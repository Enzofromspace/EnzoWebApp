import { Story } from 'inkjs';

// Load the compiled ink story
const storyContent = require('../assets/dialogue/story.ink.json');
const story = new Story(storyContent);

export const getNextDialogue = () => {
  if (story.canContinue) {
    return story.Continue();
  }
  return null;
};

export const getCurrentChoices = () => {
  return story.currentChoices;
};

export const makeChoice = (choiceIndex: number) => {
  story.ChooseChoiceIndex(choiceIndex);
}; 