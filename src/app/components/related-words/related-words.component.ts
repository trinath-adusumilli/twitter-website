import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { RelatedWords } from 'src/app/interfaces/related-words';
import { TwitterDataService } from 'src/app/services/twitter-data.service';
import { TwitterMlService } from 'src/app/services/twitter-ml.service';

@Component({
  selector: 'app-related-words',
  templateUrl: './related-words.component.html',
  styleUrls: ['./related-words.component.scss']
})
export class RelatedWordsComponent implements OnInit {

  value = '';

  constructor(private fb: FormBuilder, private mlService: TwitterMlService, private twitterDataService : TwitterDataService) { }

  // relatedWordsForm = new FormGroup({
  //   first: new FormControl('first name'),
  //   last: new FormControl('last name')
  // });

  RelatedWords: RelatedWords[] = [];
  dataSource: any;
  displayedColumns: string[] = ['position', 'word', 'confidence'];
  relatedWordsForm = this.fb.group({
    word: ['', Validators.required]
  });

  ngOnInit(): void {
  }

  searchRealtedWords(): void {
    if(this.relatedWordsForm.valid){
      this.dataSource = null;
      this.RelatedWords= [];
      //this.mlService.getRelatedWords(this.relatedWordsForm.value.word);
      this.twitterDataService.getRelatedWords(this.relatedWordsForm.value.word).subscribe(
        (response: any[]) => {
        var i = 0;
        response.forEach(element => {
          i += 1;
          this.RelatedWords.push({
            index: i,
            word: element[1],
            confidence: element[0]
          })
        });
        this.dataSource = this.RelatedWords;
      });


    }
  }
}
