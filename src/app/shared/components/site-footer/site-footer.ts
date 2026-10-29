import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  styleUrl: './site-footer.scss',
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
}
