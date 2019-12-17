import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AutocompleteService {
    baseUrl = 'https://admin.barikoi.xyz/v1/search/autocomplete/web';

    constructor(private http: HttpClient) {}

    // Get Search Result
    getAutocompleteResults(query: string) {
        const data = {
            search: query,
        };

        return this.http.post(this.baseUrl, data);
    }
}
