export interface DialogueChoice {
  text: string;
  nextNode: string;
}

interface DialogueNode {
  text: string;
  choices?: DialogueChoice[];
}

interface DialogueTree {
  [key: string]: DialogueNode;
}

const dialogueTree: DialogueTree = {
  "start": {
    text: "Welcome to the experience!\nChoose your path:",
    choices: [
      { text: "Get to Know Enzo", nextNode: "get_to_know" },
      { text: "Work With Enzo", nextNode: "work_with" },
      { text: "Kill Some Time", nextNode: "kill_time" }
    ]
  },
  "get_to_know": {
    text: "Let's explore getting to know each other...",
    choices: [
      { text: "Tell me about yourself", nextNode: "get_to_know_end" },
      { text: "What do you like to do?", nextNode: "get_to_know_end" },
      { text: "How did you get here?", nextNode: "get_to_know_end" }
    ]
  },
  "get_to_know_end": {
    text: "Thanks for getting to know me better!"
  },
  "work_with": {
    text: "Let's explore working together...",
    choices: [
      { text: "Help me with coding", nextNode: "work_with_end" },
      { text: "Help me with writing", nextNode: "work_with_end" },
      { text: "Help me brainstorm", nextNode: "work_with_end" }
    ]
  },
  "work_with_end": {
    text: "I look forward to working with you more!"
  },
  "kill_time": {
    text: "Let's do something fun...",
    choices: [
      { text: "Tell me a joke", nextNode: "kill_time_end" },
      { text: "Play a game", nextNode: "kill_time_end" },
      { text: "Random fact", nextNode: "kill_time_end" }
    ]
  },
  "kill_time_end": {
    text: "That was fun! Thanks for hanging out!"
  }
};

class DialogueManager {
  private static instance: DialogueManager;
  private currentNode: string = 'start';
  private currentText: string = dialogueTree.start.text;

  private constructor() {}

  public static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      DialogueManager.instance = new DialogueManager();
    }
    return DialogueManager.instance;
  }

  public getCurrentText(): string {
    return this.currentText;
  }

  public getCurrentChoices(): DialogueChoice[] {
    const node = dialogueTree[this.currentNode];
    return node.choices || [];
  }

  public makeChoice(choiceIndex: number): void {
    const choices = this.getCurrentChoices();
    if (choiceIndex >= 0 && choiceIndex < choices.length) {
      const nextNode = choices[choiceIndex].nextNode;
      this.currentNode = nextNode;
      this.currentText = dialogueTree[nextNode].text;
    }
  }
}

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index); 