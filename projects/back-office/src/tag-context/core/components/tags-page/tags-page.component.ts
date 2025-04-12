import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';
import { ITag, TagApiService } from '@shared/tag-context';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tags-page',
  imports: [RouterLink, MatIcon],
  templateUrl: './tags-page.component.html',
})
export class TagsPageComponent implements OnInit {
  tags = signal<ITag[]>([]);

  readonly addTagUrl: string;
  readonly editTagBaseUrl = 'edit';

  constructor(
    @Inject(ENDPOINTS_TOKEN) endpoints: IEndpoints,
    private readonly tagApiService: TagApiService
  ) {
    this.addTagUrl = endpoints.getRelativePath(EndpointId.AddTag);
  }

  ngOnInit(): void {
    void this.loadAllTags();
  }

  private async loadAllTags(): Promise<void> {
    const result = await firstValueFrom(this.tagApiService.search());
    if (result instanceof Error) {
      return;
    }
    this.tags.set(result);
  }
}
