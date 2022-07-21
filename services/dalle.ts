/* eslint-disable @typescript-eslint/ban-types */
import fetch from 'node-fetch';

const url = 'https://labs.openai.com/api/labs/tasks';

interface Task {
  object: 'task';
  id: `task-${string}`;
  created: number;
  task_type: 'text2im';
  status: 'pending' | 'succeeded' | 'rejected';
  status_information: {
    type?: 'error';
    code?: 'task_failed_text_safety_system';
    message?: string;
  };
  prompt_id: `prompt-${string}`;
  prompt: {
    id: `prompt-${string}`;
    object: 'prompt';
    created: number;
    prompt_type: 'CaptionPrompt';
    prompt: {
      caption: string;
    };
    parent_generation_id: null;
  };
  generations?: {
    object: 'list';
    data: {
      id: `generation-${string}`;
      object: 'generation';
      created: number;
      generation_type: 'ImageGeneration';
      generation: {
        image_path: string; // Image URL
      };
      task_id: `task-${string}`;
      prompt_id: `prompt-${string}`;
      is_public: boolean;
    }[];
  };
}

export async function generate(prompt: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DALLE2_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      task_type: 'text2im',
      prompt: {
        caption: prompt,
        batch_size: 4
      }
    })
  });
  const task: Task = await response.json();
  console.log('task:', task);
  const finishedTask = await new Promise<Task>(resolve => {
    const interval = setInterval(async () => {
      const nextTask = await getTask(task.id);
      console.log('nextTask:', nextTask);
      if (nextTask.status !== 'pending') {
        clearInterval(interval);
        resolve(nextTask);
      }
    }, 1000);
  });
  return {
    files: (finishedTask.generations?.data || []).map(({ id, generation }) => ({
      id: id.replace('generation-', ''),
      url: generation.image_path
    })),
    error: finishedTask.status_information.code
  };
}

async function getTask(id: string): Promise<Task> {
  const response = await fetch(`${url}/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.DALLE2_TOKEN}`
    }
  });
  const task: Task = await response.json();
  return task;
}
