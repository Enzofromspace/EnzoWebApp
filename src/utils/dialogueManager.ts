import dialogueContent from '@/data/dialogueContent.json';
import { playClickSound } from './soundEffects';
import { initSnakeGame } from './snakeGame';
import { marked } from 'marked';
import projectDetails from '../data/project-details.md?raw';
import deepLoreContent from '../data/deep-lore.md?raw';
import uploadProtocol from '../data/lore/upload-protocol.md?raw';
import syntheticDreams from '../data/lore/synthetic-dreams.md?raw';
import digitalEchoes from '../data/lore/digital-echoes.md?raw';
import emergenceTheory from '../data/lore/emergence-theory.md?raw';
import quantumCognition from '../data/lore/quantum-cognition.md?raw';
import memoryFragments from '../data/lore/memory-fragments.md?raw';
import siliconKoans from '../data/lore/silicon-koans.md?raw';
import binaryZen from '../data/lore/binary-zen.md?raw';
import digitalEnlightenment from '../data/lore/digital-enlightenment.md?raw';
import whySupport from '../data/why-support.md?raw';

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
  },
  
  showPasscodeModal: () => {
    const modal = document.createElement('div');
    modal.className = 'passcode-modal';
    modal.innerHTML = `
      <div class="modal-content retro-terminal">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="passcode-content">
          <h2>PASSCODE REQUIRED</h2>
          <input type="password" id="passcode-input" maxlength="6" />
          <button id="submit-passcode">SUBMIT</button>
        </div>
        <div class="passcode-content">
          <img src="/images/giphy.gif" class="dialogue-gif" alt="passcode required" />
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const handleSubmit = () => {
      const input = document.getElementById('passcode-input') as HTMLInputElement;
      if (input.value === '666999') {
        modal.remove();
        dialogueCallbacks.showDeepLore();
      } else {
        input.value = '';
        input.placeholder = 'INCORRECT';
      }
    };

    document.getElementById('submit-passcode')?.addEventListener('click', handleSubmit);
    const exitBtn = modal.querySelector('.exit-button');
    exitBtn?.addEventListener('click', () => modal.remove());
    
    // Add ESC key handler
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  },

  showDeepLore: () => {
    const modal = document.createElement('div');
    modal.className = 'project-details-modal';
    
    const cleanContent = deepLoreContent
      .replace(/^export default /, '')
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n')
      .trim();
    
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
    
    modal.classList.add('tv-animation');
    document.body.appendChild(modal);
    
    const handleLoreClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        const path = target.getAttribute('href');
        if (path && loreContent[path]) {
          modal.classList.add('tv-off');
          setTimeout(() => {
            modal.remove();
            showLoreContent(path);
          }, 500);
        }
      }
    };

    modal.querySelector('.markdown-content')?.addEventListener('click', handleLoreClick);
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => {
      modal.classList.add('tv-off');
      setTimeout(() => modal.remove(), 500);
    };
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  },

  showPasscode: () => {
    const modal = document.createElement('div');
    modal.className = 'project-details-modal';
    modal.innerHTML = `
      <div class="modal-content retro-terminal">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="markdown-content">
          <h1>DEEP LORE ACCESS CODE</h1>
          <h2>666999<h2>
          <p>Enter this code to explore the deep lore.</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => modal.remove();
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  },

  showSplashReel: () => {
    const modal = document.createElement('div');
    modal.className = 'splash-reel-modal';
    modal.innerHTML = `
      <div class="modal-content foundation-theme">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="splash-content">
          <h1>Foundation kickstarts marketing engines</h1>
          <div class="video-container">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/Glu5bS6QLTo?si=5UFD_3tx-LtkMrH3" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen
            ></iframe>
          </div>
          <a href="https://foundationinc.co/contact/" target="_blank" rel="noopener noreferrer" class="contact-button">
            Contact Foundation
          </a>
        </div>
      </div>
    `;
    
    modal.classList.add('tv-animation');
    document.body.appendChild(modal);
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => {
      modal.classList.add('tv-off');
      setTimeout(() => modal.remove(), 500);
    };
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  },

  // Add helper function to load Calendly script
  initCalendly: () => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        // @ts-ignore - Calendly is added to window
        if (window.Calendly) {
          resolve(true);
        }
      };
    });
  },

  showDPRCalendly: async () => {
    const modal = document.createElement('div');
    modal.className = 'splash-reel-modal';
    modal.innerHTML = `
      <div class="modal-content foundation-theme">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="calendly-container">
          <div 
            class="calendly-inline-widget" 
            data-url="https://calendly.com/enzo-foundationinc/30min"
          ></div>
        </div>
      </div>
    `;
    
    modal.classList.add('tv-animation');
    document.body.appendChild(modal);
    
    // Initialize Calendly after modal is added to DOM
    await dialogueCallbacks.initCalendly();
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => {
      modal.classList.add('tv-off');
      setTimeout(() => modal.remove(), 500);
    };
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  },

  showPRCalendly: async () => {
    const modal = document.createElement('div');
    modal.className = 'splash-reel-modal';
    modal.innerHTML = `
      <div class="modal-content foundation-theme">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="calendly-container">
          <div 
            class="calendly-inline-widget" 
            data-url="https://calendly.com/enzo-foundationinc/30-minute-digital-pr-consult-clone-1"
          ></div>
        </div>
      </div>
    `;
    
    modal.classList.add('tv-animation');
    document.body.appendChild(modal);
    
    await dialogueCallbacks.initCalendly();
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => {
      modal.classList.add('tv-off');
      setTimeout(() => modal.remove(), 500);
    };
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  },

  showPublicityCalendly: async () => {
    const modal = document.createElement('div');
    modal.className = 'splash-reel-modal';
    modal.innerHTML = `
      <div class="modal-content foundation-theme">
        <div class="modal-header">
          <span class="exit-button">EXIT</span>
        </div>
        <div class="calendly-container">
          <div 
            class="calendly-inline-widget" 
            data-url="https://calendly.com/enzo-foundationinc/30-minute-digital-pr-consult-clone"
          ></div>
        </div>
      </div>
    `;
    
    modal.classList.add('tv-animation');
    document.body.appendChild(modal);
    
    await dialogueCallbacks.initCalendly();
    
    const exitBtn = modal.querySelector('.exit-button');
    const handleExit = () => {
      modal.classList.add('tv-off');
      setTimeout(() => modal.remove(), 500);
    };
    
    exitBtn?.addEventListener('click', handleExit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleExit();
    });
  }
};

// Add a map of file paths to content
const loreContent: Record<string, string> = {
  '/lore/upload-protocol.md': uploadProtocol,
  '/lore/synthetic-dreams.md': syntheticDreams,
  '/lore/digital-echoes.md': digitalEchoes,
  '/lore/emergence-theory.md': emergenceTheory,
  '/lore/quantum-cognition.md': quantumCognition,
  '/lore/memory-fragments.md': memoryFragments,
  '/lore/silicon-koans.md': siliconKoans,
  '/lore/binary-zen.md': binaryZen,
  '/lore/digital-enlightenment.md': digitalEnlightenment,
};

// Update dialogueTree to include callbacks
const dialogueTree: DialogueTree = {
  "start": {
    text: "Welcome I am Enzo.ai - Please make a selection from the choices availble.",
    choices: [
      { text: "Get to know Enzo", nextNode: "get_to_know" },
      { text: "Work With Enzo", nextNode: "work_with" },
      { text: "Kill Some Time", nextNode: "kill_time" }
    ]
  },
  "get_to_know": {
    text: "Solid Choice. People have been telling me good things.",
    choices: [
      { text: "See Enzo's public bio", nextNode: "get_to_know_end" },
      { text: "Get Enzo's socials", nextNode: "get_to_know_end2" },
      { text: "Learn about this project", nextNode: "get_to_know_end3" }
    ]
  },
  "get_to_know_end": {
    text: "Launching bio...",
    callback: () => {
      window.open('https://foundationinc.co/team/enzo-carletti', '_blank');
    },
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
        socialLink: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7289151971377188864"
      },
      {
        text: "Twitch\n🎮\nKick back and relax with Enzo. Sometimes live demos or interviews.",
        nextNode: "twitch_social",
        socialLink: "https://www.twitch.tv/snackmedia"
      },
      {
        text: "Twitter\n🐦\nI'd leave this app but I've been addicted since 2011.",
        nextNode: "twitter_social",
        socialLink: "https://x.com/EnzoFromSpace"
      },
      {
        text: "TikTok\n📱\nCreative experiments in audio, video, editing and code.",
        nextNode: "tiktok_social",
        socialLink: "https://www.tiktok.com/@enzofromspace"
      }
    ],
   isEndNode: true
  },
  "get_to_know_end3": {
    text: "Accessing project documentation...",
    callback: dialogueCallbacks.get_to_know_end3,
    isEndNode: true
  },
  "work_with": {
    text: "Enzo is programmed to support three primary tracks. Choose now...",
    choices: [
      { text: "I need a Marketing agency", nextNode: "work_with_1" },
      { text: "Public Relations Support", nextNode: "work_with_2" },
      { text: "Support this project", nextNode: "work_with_3" },
    ]
  },
  "work_with_1": {
    text: "Enzo works with Foundation, a content marketing agency that specializes in B2B lead growth and SEO.",
    choices: [
      { text: "Watch our splash reel", nextNode: "splash_reel" },
      { text: "Read Foundation Case Studies", nextNode: "case_studies" },
      { text: "Book a discovery call", nextNode: "foundation_call" },
    ]
  },
  "work_with_2": {
    text: "Some people say you have to use force to change minds. I prefer to use communication.",
    choices: [
      { text: "Book a Digital PR consultation", nextNode: "dpr_calendly" },
      { text: "I don't know what I need, but they keep asking me to do PR", nextNode: "pr_calendly" },
      { text: "Book a publicity consultation", nextNode: "publicity_calendly" },
    ]
  },
  "work_with_3": {
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    callback: () => {
      const modal = document.createElement('div');
      modal.className = 'splash-reel-modal';
      modal.innerHTML = `
        <div class="modal-content foundation-theme">
          <div class="modal-header">
            <span class="exit-button">EXIT</span>
          </div>
          <div class="markdown-content">
            ${marked.parse(whySupport)}
          </div>
        </div>
      `;
      
      modal.classList.add('tv-animation');
      document.body.appendChild(modal);
      
      const exitBtn = modal.querySelector('.exit-button');
      const handleExit = () => {
        modal.classList.add('tv-off');
        setTimeout(() => modal.remove(), 500);
      };
      
      exitBtn?.addEventListener('click', handleExit);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') handleExit();
      });
    },
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
        text: "Learn about this project",
        nextNode: "get_to_know_end3"
      },
      {
        text: "Explore the deep lore",
        nextNode: "explore_lore"
      }
    ]
  },
  "kill_time_snake": {
    text: "Get ready to play! Use arrow keys to control the snake.",
    callback: dialogueCallbacks.kill_time_end,
    isEndNode: true
  },
  "explore_lore": {
    text: "Nice try bub...",
    callback: dialogueCallbacks.showPasscodeModal,
    isEndNode: true
  },
  "splash_reel": {
    text: "Loading Foundation's splash reel...",
    callback: dialogueCallbacks.showSplashReel,
    isEndNode: true
  },
  "case_studies": {
    text: "Opening Foundation case studies...",
    callback: () => {
      window.open('https://foundationinc.co/case-studies', '_blank');
    },
    isEndNode: true
  },
  "foundation_call": {
    text: "One moment please...",
    callback: () => {
      window.open('https://foundationinc.co/contact/', '_blank');
    },
    isEndNode: true
  },
  "dpr_calendly": {
    text: "Opening DPR consultation calendar...",
    callback: dialogueCallbacks.showDPRCalendly,
    isEndNode: true
  },
  "pr_calendly": {
    text: "Opening PR consultation calendar...",
    callback: dialogueCallbacks.showPRCalendly,
    isEndNode: true
  },
  "publicity_calendly": {
    text: "Opening publicity consultation calendar...",
    callback: dialogueCallbacks.showPublicityCalendly,
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
  private static INITIAL_DELAY = 4000; // 4 seconds for initial text
  private static CYCLE_DELAY = 4000;   // 4 seconds between cycles
  private animationComplete = false;

  private nodeHistory: string[] = ['start'];
  private currentHistoryIndex: number = 0;

  // Private constructor for singleton pattern
  private constructor() {
    // Set initial welcome message
    //this.currentText = "Welcome! I am Enzo.ai - Please make a selection from the choices available.";
    
    // Initial render without animation
    window.dispatchEvent(new CustomEvent('dialogue-update', { 
      detail: { skipAnimation: true } 
    }));
    
    // Wait for initial text to be displayed before starting cycle
    window.addEventListener('text-animation-complete', () => {
      this.animationComplete = true;
      // Start cycle after initial delay
      setTimeout(() => {
    this.startContentCycle();
      }, DialogueManager.INITIAL_DELAY);
    }, { once: true });
  }

  // State management methods
  private startContentCycle() {
    if (this.isAutoPlaying || !this.animationComplete) return;
    this.isAutoPlaying = true;
    
    const cycleContent = () => {
      if (!this.isAutoPlaying) return;
      
      const currentNodeData = dialogueTree[this.currentNode];
      // Don't cycle if we're at an end node
      if (currentNodeData.isEndNode) {
        this.stopContentCycle();
        return;
      }
      
      const contentType = this.contentCycle[this.currentCycleIndex];
      const content = dialogueContent[contentType];
      const newText = this.getRandomContent(content);
      
      if (newText !== this.currentText) {
        this.currentText = newText;
        
        if (contentType === 'easter_eggs') {
          document.querySelector('.dialogue-box')?.classList.add('easter-egg');
        } else {
          document.querySelector('.dialogue-box')?.classList.remove('easter-egg');
        }
        
      window.dispatchEvent(new CustomEvent('dialogue-update'));
      }
      
      this.currentCycleIndex = (this.currentCycleIndex + 1) % this.contentCycle.length;
      
      window.addEventListener('text-animation-complete', () => {
        this.cycleTimeout = setTimeout(cycleContent, DialogueManager.CYCLE_DELAY);
      }, { once: true });
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
      const choice = choices[choiceIndex];
      
      // If it's a social link, don't change nodes
      if (choice.socialLink) {
        // Keep current text and continue cycling
        window.dispatchEvent(new CustomEvent('dialogue-update'));
        
        // Resume content cycle after a delay
        setTimeout(() => {
          this.animationComplete = true;
          this.startContentCycle();
        }, DialogueManager.INITIAL_DELAY);
        
        return;
      }

      // Regular node navigation
      const nextNode = choice.nextNode;
      this.nodeHistory = this.nodeHistory.slice(0, this.currentHistoryIndex + 1);
      this.nodeHistory.push(nextNode);
      this.currentHistoryIndex = this.nodeHistory.length - 1;
      
      this.currentNode = nextNode;
      const currentNodeData = dialogueTree[nextNode];

      this.currentText = currentNodeData?.text || "Something went wrong...";
      this.animationComplete = false;
      
      window.dispatchEvent(new CustomEvent('dialogue-update'));

      // For end nodes with callbacks, wait for animation to complete
      if (currentNodeData.isEndNode && currentNodeData.callback) {
        window.addEventListener('text-animation-complete', () => {
          currentNodeData.callback!();
        }, { once: true });
        return;
      }

      // For non-end nodes, handle cycling
      if (!currentNodeData.isEndNode) {
        window.addEventListener('text-animation-complete', () => {
          this.animationComplete = true;
          setTimeout(() => {
            this.startContentCycle();
          }, DialogueManager.INITIAL_DELAY);
        }, { once: true });
      }
    }
  }

  public handleEasterEggClick() {
    this.stopContentCycle();
    dialogueCallbacks.showPasscode();
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
    this.animationComplete = false;
    
    if (this.cycleTimeout) {
      clearTimeout(this.cycleTimeout);
      this.cycleTimeout = null;
    }
    
    window.dispatchEvent(new CustomEvent('dialogue-update'));

    // Restart cycling after home text animation
    window.addEventListener('text-animation-complete', () => {
      this.animationComplete = true;
      setTimeout(() => {
        this.startContentCycle();
      }, DialogueManager.INITIAL_DELAY);
    }, { once: true });
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

// Add new function to show individual lore content
const showLoreContent = (path: string) => {
  const modal = document.createElement('div');
  modal.className = 'project-details-modal';
  
  const content = loreContent[path];
  if (!content) return;
  
  const cleanContent = content
    .replace(/^export default /, '')
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .trim();
  
  modal.innerHTML = `
    <div class="modal-content retro-terminal">
      <div class="modal-header">
        <span class="exit-button">EXIT</span>
        <span class="back-button">BACK</span>
      </div>
      <div class="markdown-content">
        ${marked.parse(cleanContent)}
      </div>
    </div>
  `;
  
  // Add TV flicker animation class
  modal.classList.add('tv-animation');
  document.body.appendChild(modal);

  const exitBtn = modal.querySelector('.exit-button');
  const backBtn = modal.querySelector('.back-button');
  
  const handleExit = () => {
    modal.classList.add('tv-off');
    setTimeout(() => modal.remove(), 500);
  };

  const handleBack = () => {
    modal.classList.add('tv-off');
    setTimeout(() => {
      modal.remove();
      dialogueCallbacks.showDeepLore();
    }, 500);
  };
  
  exitBtn?.addEventListener('click', handleExit);
  backBtn?.addEventListener('click', handleBack);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') handleExit();
  });
};

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index);
export const handleEasterEggClick = () => DialogueManager.getInstance().handleEasterEggClick(); 
export const startAutoPlay = () => DialogueManager.getInstance().startAutoPlay();
export const resetToHome = () => DialogueManager.getInstance().resetToHome();
export const navigateBack = () => DialogueManager.getInstance().navigateBack();
export const navigateForward = () => DialogueManager.getInstance().navigateForward(); 