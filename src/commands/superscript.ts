import command from '$services/command';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const superscript =
  'ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹';

export default command(
  {
    desc: 'Converts a message to superscript',
    options: {
      message: {
        type: 'string',
        desc: 'The message to convert'
      }
    }
  },
  (i, { message }) => {
    const converted = message
      .split('')
      .map(char => {
        const index = chars.indexOf(char);
        return superscript[index] || char;
      })
      .join('');
    return i.reply(converted);
  }
);
