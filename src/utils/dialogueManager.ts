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

export type ContentType = 'thoughts' | 'jokes' | 'quotes' | 'easter_eggs';

const content = {
  thoughts: [
    "What if consciousness is just the universe trying to understand itself?",
    "The nature of existence might be simpler than we think, or far more complex.",
    "Maybe the real AI was the friends we made along the way.",
  ],
  jokes: [
    "Why did the AI cross the road? To get to the other dataset!",
    "What do you call an AI that loves to garden? A neural network in bloom!",
    "How does an AI take its coffee? With artificial sweeteners!",
  ],
  quotes: [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Life is what happens while you're busy making other plans.",
    "The only way to do great work is to love what you do.",
  ],
  easter_eggs: [
    "Click me if you dare! 🎮",
    "Secret level unlocked? 🔓",
    "You found the hidden message! 🎯",
  ]
};

const dialogueTree: DialogueTree = {
  "start": {
    text: "Welcome internet traveler.\nChoose your path:",
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
      { text: "Tell me a joke", nextNode: "tell_joke" },
      { text: "Share a quote", nextNode: "share_quote" },
      { text: "Random thought", nextNode: "share_thought" }
    ]
  },
  "tell_joke": {
    text: "Why did the AI cross the road? To get to the other dataset!"
  },
  "share_quote": {
    text: "The future belongs to those who believe in the beauty of their dreams."
  },
  "share_thought": {
    text: "What if consciousness is just the universe trying to understand itself?"
  }
};

class DialogueManager {
  private static instance: DialogueManager;
  private currentNode: string = 'start';
  private currentText: string = dialogueTree.start.text;
  private contentCycle: ContentType[] = ['thoughts', 'jokes', 'quotes', 'easter_eggs'];
  private currentCycleIndex: number = 0;
  private isAutoPlaying: boolean = false;
  private cycleTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    // Remove automatic start of content cycle
    // We'll start it externally when appropriate
  }

  private startContentCycle() {
    if (this.isAutoPlaying) return;
    this.isAutoPlaying = true;
    
    const cycleContent = () => {
      if (!this.isAutoPlaying) return;
      
      const contentType = this.contentCycle[this.currentCycleIndex];
      this.currentText = this.getRandomContent(content[contentType]);
      
      window.dispatchEvent(new CustomEvent('dialogue-update'));
      
      this.currentCycleIndex = (this.currentCycleIndex + 1) % this.contentCycle.length;
      
      // Store timeout reference so we can clear it later
      this.cycleTimeout = setTimeout(cycleContent, 5000);
    };

    // Start the cycle
    this.cycleTimeout = setTimeout(cycleContent, 5000);
  }

  private stopContentCycle() {
    this.isAutoPlaying = false;
    if (this.cycleTimeout) {
      clearTimeout(this.cycleTimeout);
      this.cycleTimeout = null;
    }
  }

  public static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      DialogueManager.instance = new DialogueManager();
    }
    return DialogueManager.instance;
  }

  private getRandomContent(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  public getCurrentText(): string {
    return this.currentText;
  }

  public getCurrentChoices(): DialogueChoice[] {
    const node = dialogueTree[this.currentNode];
    return node.choices || [];
  }

  public makeChoice(choiceIndex: number): void {
    // Stop auto-play when user makes a choice
    this.stopContentCycle();

    const choices = this.getCurrentChoices();
    if (choiceIndex >= 0 && choiceIndex < choices.length) {
      const nextNode = choices[choiceIndex].nextNode;
      this.currentNode = nextNode;

      // Handle special nodes that need random content
      switch (nextNode) {
        case 'tell_joke':
          this.currentText = this.getRandomContent(content.jokes);
          break;
        case 'share_quote':
          this.currentText = this.getRandomContent(content.quotes);
          break;
        case 'share_thought':
          this.currentText = this.getRandomContent(content.thoughts);
          break;
        default:
          this.currentText = dialogueTree[nextNode]?.text || "Something went wrong...";
      }
    }
  }

  public handleEasterEggClick() {
    this.stopContentCycle();
    this.currentText = "You've discovered a secret! 🎉";
    window.dispatchEvent(new CustomEvent('dialogue-update'));
  }

  // Add method to start auto-play externally
  public startAutoPlay() {
    this.startContentCycle();
  }
}

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index);
export const handleEasterEggClick = () => DialogueManager.getInstance().handleEasterEggClick();
export const startAutoPlay = () => DialogueManager.getInstance().startAutoPlay(); 