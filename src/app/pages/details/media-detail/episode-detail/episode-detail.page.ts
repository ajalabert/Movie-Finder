import { BookmarkService } from './../../../../services/bookmark.service';
import { BookmarkedMedia } from './../../../../../models/bookmarkedMedia';
import { Episode } from './../../../../../models/episode';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { OmdbApiService } from 'src/app/services/omdb-api.service';
import { MediaDetailPage } from '../media-detail.page';

@Component({
  selector: 'app-episode-detail',
  templateUrl: './episode-detail.page.html',
  styleUrls: ['./../media-detail.page.scss'],
})
export class EpisodeDetailPage extends MediaDetailPage {

  episode: Episode;
  isFavorite: boolean;
  imageUrl: string;

  constructor(public api: OmdbApiService,
    private route: ActivatedRoute,
    bookmarkService: BookmarkService) {
      super(bookmarkService);
     }

  async ionViewWillEnter(){
    var id = this.route.snapshot.paramMap.get('id');
    this.episode = await this.api.getMediaInfo<Episode>(id);

    this.bookemarkedMedia = <BookmarkedMedia> {
      Title: this.episode.Title,
      imdbID: this.episode.imdbID,
      Type: this.episode.Type,
    };

    this.isFavorite = await this.bookmarkService.isMediaAlreadyBookmarked(this.bookemarkedMedia);
    
    await this.verifyImageUrlValidity();
  }

  async verifyImageUrlValidity(){
    var isPosterUrlValid = await this.api.verifyImageUrl(this.episode.Poster);
    if (isPosterUrlValid){
      this.imageUrl = this.episode.Poster; //img.omdb api doesn't provide posters for episodes
    }
    else {
      this.imageUrl = "http://www.citypages.com/img/movie-placeholder.gif";
    }
  }

}
