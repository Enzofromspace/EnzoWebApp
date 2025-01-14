import dialogueContent from '@/data/dialogueContent.json';
import { playClickSound } from './soundEffects';

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
    text: "Solid Choice. People have been telling me good things.",
    choices: [
      { text: "See the resume", nextNode: "get_to_know_end" },
      { text: "Get Enzo's socials", nextNode: "get_to_know_end2" },
      { text: "Learn about this project", nextNode: "get_to_know_end3" }
    ]
  },
  "get_to_know_end": {
    text: "I hope you'll find my creator's experience intriguing"
  },
  "get_to_know_end2": {
    text: "Oof. Harsh choice. I hear Enzo's pretty weird online...much cooler in person."
  },
  "get_to_know_end3": {
    text: "A curious mind is often rewarded. Respect."
  },
  "work_with": {
    text: "Enzo is programmed to support three primary tracks. Choose now...",
    choices: [
      { text: "I'm ready for a marketing agency", nextNode: "work_with_end" },
      { text: "I need marketing consultation", nextNode: "work_with_end" },
      { text: "Support this project", nextNode: "work_with_end" }
    ]
  },
  "work_with_end": {
    text: "I look forward to working with you more!"
  },
  "kill_time": {
    text: "Ticking away the moments that make up a dull day.",
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
  // Singleton instance for global state management
  private static instance: DialogueManager;
  
  // Core state variables
  private currentNode: string = 'start';  // Tracks current position in dialogue tree
  private currentText: string = dialogueTree.start.text;  // Current displayed text
  
  // Auto-play cycle state
  private contentCycle: ContentType[] = ['thoughts', 'jokes', 'quotes', 'easter_eggs'];
  private currentCycleIndex: number = 0;
  private isAutoPlaying: boolean = false;
  private cycleTimeout: NodeJS.Timeout | null = null;
  private static CYCLE_DELAY = 8000;

  // Private constructor for singleton pattern
  private constructor() {}

  // State management methods
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
    // Reset auto-play state
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

  // Public state accessors
  public getCurrentText(): string {
    return this.currentText;
  }

  public getCurrentChoices(): DialogueChoice[] {
    return dialogueTree[this.currentNode].choices || [];
  }

  public makeChoice(choiceIndex: number): void {
    this.stopContentCycle();
    playClickSound().catch(console.error);

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