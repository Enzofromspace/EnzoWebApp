import dialogueContent from '@/data/dialogueContent.json';
import { playClickSound } from './soundEffects';
import { initSnakeGame } from './snakeGame';

export interface DialogueChoice {
  text: string;
  nextNode: string;
}

// Add new types for callbacks
type DialogueCallback = () => void;

interface DialogueNode {
  text: string;
  choices?: DialogueChoice[];
  callback?: DialogueCallback;
  isEndNode?: boolean;
}

interface DialogueTree {
  [key: string]: DialogueNode;
}

export type ContentType = 'thoughts' | 'jokes' | 'quotes' | 'easter_eggs';

// Add callback registry
const dialogueCallbacks: Record<string, DialogueCallback> = {
  get_to_know_end: () => {
    // Display resume
    const modal = document.createElement('div');
    modal.className = 'resume-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <img src="/images/online_EnzoCarlettiCV.2025.png" alt="Resume" />
      </div>
    `;
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-button');
    closeBtn?.addEventListener('click', () => modal.remove());
  },
  
  work_with_end: () => {
    // Display intake form
    const formModal = document.createElement('div');
    formModal.className = 'form-modal';
    formModal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <form id="intake-form">
          <h2>Work With Enzo</h2>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email" required />
          <select required>
            <option value="">Select Service</option>
            <option value="agency">Marketing Agency</option>
            <option value="consultation">Marketing Consultation</option>
            <option value="support">Project Support</option>
          </select>
          <textarea placeholder="Tell me about your project"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    `;
    document.body.appendChild(formModal);
    
    const closeBtn = formModal.querySelector('.close-button');
    closeBtn?.addEventListener('click', () => formModal.remove());
    
    const form = formModal.querySelector('#intake-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      // Handle form submission
      formModal.remove();
    });
  },
  
  kill_time_end: () => {
    // Initialize Snake game
    const gameModal = document.createElement('div');
    gameModal.className = 'game-modal';
    gameModal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <canvas id="snake-game" width="400" height="400"></canvas>
        <div class="game-controls">
          <button id="start-game">Start Game</button>
          <span class="score">Score: 0</span>
        </div>
      </div>
    `;
    document.body.appendChild(gameModal);
    
    const closeBtn = gameModal.querySelector('.close-button');
    closeBtn?.addEventListener('click', () => {
      gameModal.remove();
      // Reset to kill_time node instead of home
      DialogueManager.getInstance().setNode('kill_time');
    });
    
    // Initialize snake game
    initSnakeGame();
  }
};

// Update dialogueTree to include callbacks
const dialogueTree: DialogueTree = {
  "start": {
    text: "Welcome internet traveler. Choose your path:",
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
    text: "I hope you'll find my creator's experience intriguing",
    callback: dialogueCallbacks.get_to_know_end,
    isEndNode: true
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
    text: "I look forward to working with you more!",
    callback: dialogueCallbacks.work_with_end,
    isEndNode: true
  },
  "kill_time": {
    text: "How would you like to spend your time?",
    choices: [
      {
        text: "Let's play Snake! 🐍",
        nextNode: "kill_time_snake"
      },
      {
        text: "Tell me a joke",
        nextNode: "tell_joke"
      },
      {
        text: "Share a quote",
        nextNode: "share_quote"
      }
    ]
  },
  "kill_time_snake": {
    text: "Get ready to play! Use arrow keys to control the snake.",
    callback: dialogueCallbacks.kill_time_end,
    isEndNode: true
  },
  "tell_joke": {
    text: "Why did the AI cross the road? To get to the other dataset!"
  },
  "share_quote": {
    text: "The future belongs to those who believe in the beauty of their dreams."
  },
  "share_thought": {
    text: "What if consciousness is just the universe trying to understand itself?"
  },
  "kill_time_end": {
    text: "Let's play a game!",
    callback: dialogueCallbacks.kill_time_end,
    isEndNode: true
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

  private nodeHistory: string[] = ['start'];
  private currentHistoryIndex: number = 0;

  // Private constructor for singleton pattern
  private constructor() {
    // Show initial greeting for 8 seconds, then start cycle
    setTimeout(() => {
      this.startContentCycle();
    }, DialogueManager.CYCLE_DELAY);
  }

  // State management methods
  private startContentCycle() {
    if (this.isAutoPlaying) return;
    this.isAutoPlaying = true;
    
    const cycleContent = () => {
      if (!this.isAutoPlaying) return;
      
      const contentType = this.contentCycle[this.currentCycleIndex];
      const content = dialogueContent[contentType];
      this.currentText = this.getRandomContent(content);
      
      // Add clickable class for easter eggs
      if (contentType === 'easter_eggs') {
        document.querySelector('.dialogue-box')?.classList.add('easter-egg');
      } else {
        document.querySelector('.dialogue-box')?.classList.remove('easter-egg');
      }
      
      window.dispatchEvent(new CustomEvent('dialogue-update'));
      
      this.currentCycleIndex = (this.currentCycleIndex + 1) % this.contentCycle.length;
      
      // Schedule next update
      this.cycleTimeout = setTimeout(cycleContent, DialogueManager.CYCLE_DELAY);
    };

    cycleContent();
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
      
      // Update history
      this.nodeHistory = this.nodeHistory.slice(0, this.currentHistoryIndex + 1);
      this.nodeHistory.push(nextNode);
      this.currentHistoryIndex = this.nodeHistory.length - 1;
      
      this.currentNode = nextNode;
      const currentNodeData = dialogueTree[nextNode];

      // Execute callback if it exists and is an end node
      if (currentNodeData.isEndNode && currentNodeData.callback) {
        currentNodeData.callback();
      }

      // Update text based on node type
      this.currentText = currentNodeData?.text || "Something went wrong...";
      
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

  public navigateBack(): void {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.currentNode = this.nodeHistory[this.currentHistoryIndex];
      this.currentText = dialogueTree[this.currentNode].text;
      window.dispatchEvent(new CustomEvent('dialogue-update'));
    }
  }

  public navigateForward(): void {
    if (this.currentHistoryIndex < this.nodeHistory.length - 1) {
      this.currentHistoryIndex++;
      this.currentNode = this.nodeHistory[this.currentHistoryIndex];
      this.currentText = dialogueTree[this.currentNode].text;
      window.dispatchEvent(new CustomEvent('dialogue-update'));
    }
  }

  // Add new method to set current node
  public setNode(node: string): void {
    this.currentNode = node;
    this.currentText = dialogueTree[node].text;
    window.dispatchEvent(new CustomEvent('dialogue-update'));
  }
}

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index);
export const handleEasterEggClick = () => DialogueManager.getInstance().handleEasterEggClick();
export const startAutoPlay = () => DialogueManager.getInstance().startAutoPlay();
export const resetToHome = () => DialogueManager.getInstance().resetToHome();
export const navigateBack = () => DialogueManager.getInstance().navigateBack();
export const navigateForward = () => DialogueManager.getInstance().navigateForward(); 