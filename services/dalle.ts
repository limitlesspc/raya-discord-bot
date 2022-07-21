/* eslint-disable @typescript-eslint/ban-types */
import fetch from 'node-fetch';

const url = 'https://labs.openai.com/api/labs/tasks';

interface Task {
  object: 'task';
  id: `task-${string}`;
  created: number;
  task_type: 'text2im';
  status: 'pending' | 'succeeded';
  status_information: {};
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

export async function generate(prompt: string): Promise<string[]> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DALLE2_TOKEN}`
    },
    body: JSON.stringify({
      task_type: 'text2im',
      prompt: {
        caption: prompt,
        batch_size: 4
      }
    })
  });
  const { id }: Task = await response.json();
  const task = await new Promise<Task>(resolve => {
    const interval = setInterval(async () => {
      const task = await getTask(id);
      if (task.status === 'succeeded') {
        clearInterval(interval);
        resolve(task as Task);
      }
    }, 1000);
  });
  return (task.generations?.data || []).map(
    ({ generation }) => generation.image_path
  );
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
