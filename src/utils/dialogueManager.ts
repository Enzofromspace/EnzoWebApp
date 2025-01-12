import dialogueContent from '@/data/dialogueContent.json';
import { playChoiceSound } from './soundEffects';

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
  private static CYCLE_DELAY = 8000;

  private constructor() {}

  private startContentCycle() {
    if (this.isAutoPlaying) return;
    this.isAutoPlaying = true;
    
    const cycleContent = () => {
      if (!this.isAutoPlaying) return;
      
      const contentType = this.contentCycle[this.currentCycleIndex];
      this.currentText = this.getRandomContent(dialogueContent[contentType]);
      
      window.dispatchEvent(new CustomEvent('dialogue-update'));
      
      this.currentCycleIndex = (this.currentCycleIndex + 1) % this.contentCycle.length;
    };

    // Start the cycle
    cycleContent();

    // Listen for text animation completion to schedule next cycle
    const handleAnimationComplete = () => {
      if (this.isAutoPlaying) {
        this.cycleTimeout = setTimeout(cycleContent, DialogueManager.CYCLE_DELAY);
      }
    };

    window.addEventListener('text-animation-complete', handleAnimationComplete);
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
    this.stopContentCycle();
    playChoiceSound().catch(console.error);

    const choices = this.getCurrentChoices();
    if (choiceIndex >= 0 && choiceIndex < choices.length) {
      const nextNode = choices[choiceIndex].nextNode;
      this.currentNode = nextNode;

      switch (nextNode) {
        case 'tell_joke':
          this.currentText = this.getRandomContent(dialogueContent.jokes);
          break;
        case 'share_quote':
          this.currentText = this.getRandomContent(dialogueContent.quotes);
          break;
        case 'share_thought':
          this.currentText = this.getRandomContent(dialogueContent.thoughts);
          break;
        default:
          this.currentText = dialogueTree[nextNode]?.text || "Something went wrong...";
      }
      
      window.dispatchEvent(new CustomEvent('dialogue-update'));
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

  public resetToHome(): void {
    this.stopContentCycle();
    this.currentNode = 'start';
    this.currentText = dialogueTree.start.text;
    this.currentCycleIndex = 0;
    this.isAutoPlaying = false;
    if (this.cycleTimeout) {
      clearTimeout(this.cycleTimeout);
      this.cycleTimeout = null;
    }
    window.dispatchEvent(new CustomEvent('dialogue-update'));
  }
}

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index);
export const handleEasterEggClick = () => DialogueManager.getInstance().handleEasterEggClick();
export const startAutoPlay = () => DialogueManager.getInstance().startAutoPlay();
export const resetToHome = () => DialogueManager.getInstance().resetToHome(); 