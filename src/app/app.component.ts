import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-portal';

  links = [
    {text: 'Labelling', route: ''},
    {text: 'Labelled Data', route: ''},
    {text: 'Status', route: ''},
    {text: 'Related Words', route: 'related-words'},
    {text: 'Map', route: 'map'},
    {text: 'Logout', route: ''}
  ];
  activeLink = this.links[0].text;

}
