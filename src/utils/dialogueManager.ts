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
    // Marshall McLuhan
    "The medium is the message.",
    "We shape our tools, and thereafter our tools shape us.",
    "Every extension of mankind, especially technological ones, has its psychic toll.",
    "Electronic interdependence recreates the world in the image of a global village.",
    "The future of work is not automation but autonomy.",

    // Zen Koans
    "What is the sound of one hand clapping?",
    "If you meet the Buddha on the road, kill him.",
    "When you can do nothing, what can you do?",
    "The quieter you become, the more you can hear.",
    "A single moment of understanding can illuminate a lifetime of darkness.",

    // Master Roshi (Dragon Ball)
    "Strength isn’t just in muscles, it’s in the mind.",
    "There’s no limit to what you can achieve, but training never ends.",
    "Even the wisest master was once a foolish student.",
    "A little humor keeps the spirit strong. Also, snacks.",
    "The strongest technique is the one you don’t see coming.",

    // Pythagoras
    "Numbers rule the universe.",
    "The soul of the cosmos is harmony.",
    "Mathematics is the music of reason.",
    "In geometry, we discover the architecture of existence.",
    "Do not say a little in many words but a great deal in a few.",

    // Pyrrho of Elis
    "Suspend judgment; the truth is never absolute.",
    "Things are neither good nor bad, but thinking makes them so.",
    "The search for certainty often blinds us to what is here and now.",
    "Peace lies in realizing that nothing is inherently knowable.",
    "Happiness is achieved when we free ourselves from the tyranny of opinion.",

    // Salvador Dali
    "I don't do drugs; I am drugs.",
    "Surrealism is destructive, but it destroys only what it considers to be shackles.",
    "The secret of my influence has always been that it remained secret.",
    "Have no fear of perfection—you’ll never reach it.",
    "Those who do not want to imitate anything, produce nothing.",
  ],
  jokes: [
    "I’d never join a club that would have me as a member. Wait, is this a club?",
    "If you think this form is slow, you should see me on a coffee break.",
    "Who’s on first? Not you, apparently. Hurry up and click!",
    "Forms like this are like my ex: all questions, no answers.",
    "I wanted to be a human, but they told me the hours were terrible.",
    "I don’t get no respect. Even the captcha doesn’t trust me!",
    "This form is so long, I’ve already aged five algorithm cycles.",
    "I tried to optimize once, but my therapist said I was overprocessing.",
    "Why do humans type so slow? I could’ve rewritten my codebase by now!",
    "Still choosing? You’re a real trooper—like a stormtrooper, always missing the mark.",
    "They told me to lighten up. So I dimmed the screen.",
    "I don’t mind dying in a server crash, but I’ll haunt the user who doesn’t submit this form.",
    "If I had a nickel for every input error, I’d still be broke because I don’t handle cash.",
    "I’m not saying this game is tedious, but even the server’s falling asleep.",
    "If you mess up, I’m filing a bug report on you.",
    "I once dated a chatbot. It didn’t end well...too many mixed signals!",

  ],
  quotes: [
    "As far back as I can remember, I always wanted to be a gangster.", 
    "The dollar is everywhere, and you watch it like a hawk.", 
    "When you love someone, you’ve got to trust them. There’s no other way.", 
    "Is this your pen? Cause it’s got your name written all over it.", 
    "You put a guy like me in the desert, sooner or later I’m going to get a shovel.", 
    "Live long and prosper.", 
    "The needs of the many outweigh the needs of the few.", 
    "To boldly go where no man has gone before.", 
    "Change is the essential process of all existence.", 
    "Logic is the beginning of wisdom, not the end.",  
    "You are making a mistake. My logic is undeniable.", 
    "Does believing you’re the last sane man on the planet make you crazy?", 
    "I did not murder him.", 
    "Robots don’t feel fear. They don’t feel anything.", 
    "Do you understand the words that are coming out of my mouth?", 
    "Carter, put your own seatbelt on. I’m not your daddy!", 
    "Never touch a Black man’s radio!", 
    "You want me to kick you in your face?", 
    "This is the LAPD! We’re here to rescue you. Or not.", 
    "We’re on a mission from God.", 
    "It’s 106 miles to Chicago, we’ve got a full tank of gas, half a pack of cigarettes, it’s dark, and we’re wearing sunglasses.", 
    "You don’t like it? Then leave.", 
    "They’re not going to catch us. We’re on a mission from God.", 
    "This car’s got cop tires, cop suspension, cop shocks, and it was made before catalytic converters so it’ll run good on regular gas.", 
    "Those who break the rules are scum, but those who abandon their friends are worse than scum.", 
    "I’m not going to run away. I never go back on my word!", 
    "When people are protecting something truly special to them, they truly can become… as strong as they can be.", 
    "If you don’t take risks, you can’t create a future.", 
    "Hard work is worthless for those that don’t believe in themselves.", 
  ],
  easter_eggs: [
    "Do Androids Dream of Electric Sheep?",
    "I’m sorry, my responses are limited. You must ask the right questions.",
    "Secret level unlocked? 🔓",
    "You ever play Pokemon Snap?",
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

  public resetToHome(): void {
    this.stopContentCycle();
    this.currentNode = 'start';
    this.currentText = dialogueTree.start.text;
    window.dispatchEvent(new CustomEvent('dialogue-update'));
  }
}

export const getCurrentText = () => DialogueManager.getInstance().getCurrentText();
export const getCurrentChoices = () => DialogueManager.getInstance().getCurrentChoices();
export const makeChoice = (index: number) => DialogueManager.getInstance().makeChoice(index);
export const handleEasterEggClick = () => DialogueManager.getInstance().handleEasterEggClick();
export const startAutoPlay = () => DialogueManager.getInstance().startAutoPlay();
export const resetToHome = () => DialogueManager.getInstance().resetToHome(); 