import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface CharWithRule {
  char: string;
  rule: string; // e.g., "madd_2", "hamzat_wasl", or "" for no rule
}

interface GroupedText {
  text: string;
  rule: string;
}

@Component({
  selector: 'app-tajweed-viewer',
  templateUrl: './tajweed-viewer.component.html',
   imports: [CommonModule],
  styleUrls: ['./tajweed-viewer.component.css']
})
export class TajweedViewerComponent implements OnInit {
  @Input() ayahText: string = '';
  @Input() annotations: { start: number, end: number, rule: string }[] = [];
  @Input() ayahNumber!: number;

  characters: string[] = [];

  ngOnInit() {
    this.characters = Array.from(this.ayahText); // Splits correctly for Arabic
  }

  getTajweedClass(index: number): string {
    const rule = this.annotations.find(a => index >= a.start && index < a.end)?.rule;
    return rule ? `rule-${rule}` : '';
  }

  onCharClick(index: number) {
    const rule = this.annotations.find(a => index >= a.start && index < a.end);
    console.log(`Clicked index: ${index}, rule:`, rule);
    // You can emit an event or highlight selection
  }
  
  onTextClick(event: MouseEvent) {
  const selection = window.getSelection();
  if (!selection) return;

  const offset = selection.focusOffset;
  const charIndex = this.ayahText.length - offset; // because of RTL
  const rule = this.annotations.find(a => charIndex >= a.start && charIndex < a.end);
  console.log('Clicked index:', charIndex, 'Rule:', rule);
}

getCharacters(): { char: string, index: number}[] {
    return this.ayahText.split('').map((char, i) => ({
      char,
      index: i
    }));
}

}
