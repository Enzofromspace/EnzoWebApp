import dialogueContent from '@/data/dialogueContent.json';
import { playClickSound } from './soundEffects';
import { initSnakeGame } from './snakeGame';
import { marked } from 'marked';
import projectDetails from '@/data/project-details.md?raw';

// Configure marked to handle line breaks properly
marked.setOptions({
  breaks: true,
  gfm: true
});

export interface DialogueChoice {
  text: string;
  nextNode: string;
  socialLink?: string;
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
    const modal = document.createElement('div');
    modal.className = 'resume-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="resume-container">
          <img src="/images/online_EnzoCarlettiCV.2025.png" alt="Resume" class="resume-image" />
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-button');
    const img = modal.querySelector('.resume-image') as HTMLImageElement;
    let scale = 1;
    let isDragging = false;
    let startX: number, startY: number, translateX = 0, translateY = 0;

    // Add zoom functionality
    modal.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale *= delta;
      scale = Math.min(Math.max(0.5, scale), 3); // Limit zoom between 0.5x and 3x
      img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });

    // Add drag functionality
    img.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      img.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      img.style.cursor = 'grab';
    });

    closeBtn?.addEventListener('click', () => {
      modal.remove();
    });
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

    // Add ESC key handler
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        formModal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
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
  },
  
  get_to_know_end3: () => {
    const modal = document.createElement('div');
    modal.className = 'project-details-modal';
    
    // Clean up the markdown content
    const cleanContent = projectDetails.replace(/\\n/g, '\n');
    
    modal.innerHTML = `
      <div class="modal-content retro-terminal">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="markdown-content">
          ${marked.parse(cleanContent)}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => modal.remove();
    
    exitBtn?.addEventListener('click', handleExit);
    // Add ESC key handler
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }
};

// Update dialogueTree to include callbacks
const dialogueTree: DialogueTree = {
  "start": {
    text: "Welcome I am Enzo.ai - Please make a selection from the choices availble to begin your adventure.",
    choices: [
      { text: "Get to know Enzo", nextNode: "get_to_know" },
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
    text: "This screen is a placeholder TBH. So many better things to click. Go click arround.",
    callback: dialogueCallbacks.get_to_know_end,
    isEndNode: true
  },
  "get_to_know_end2": {
    text: "Electronic interdependence recreates the world in the image of a global village.",
    choices: [
      {
        text: "YouTube\n🎥\nAI Tutorials for Code, Marketing, and Business.",
        nextNode: "youtube_social",
        socialLink: "https://youtube.com"
      },
      {
        text: "LinkedIn\n💼\nWeekly Newsletter on Marketing, Business, or Philosophy.",
        nextNode: "linkedin_social",
        socialLink: "https://www.linkedin.com/in/enzo-carletti/"
      },
      {
        text: "Twitch\n🎮\nKick back and relax with Enzo. Sometimes live demos or interviews.",
        nextNode: "twitch_social",
        socialLink: "https://www.twitch.tv/snackmedia"
      },
      {
        text: "Twitter\n🐦\nNo real strategy here, only memes and wrestling clips.",
        nextNode: "twitter_social",
        socialLink: "https://x.com/EnzoFromSpace"
      },
      {
        text: "TikTok\n📱\nCreative experiments in audio, video, and editing. Unhinged.",
        nextNode: "tiktok_social",
        socialLink: "https://www.tiktok.com/@enzofromspace"
      }
    ]
  },
  "get_to_know_end3": {
    text: "Accessing project documentation...",
    callback: dialogueCallbacks.get_to_know_end3,
    isEndNode: true
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