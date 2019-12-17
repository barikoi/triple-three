import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { AutocompleteService } from '../../services/autocomplete.service';
import { DataVesselService } from 'src/app/services/data-vessel.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    searchResult: any[] = [];
    query: FormControl = new FormControl();

    constructor(
        private autocompleteService: AutocompleteService,
        private dataVesselService: DataVesselService
    ) {
    }

    clearField() {
        this.query.reset();
        this.searchResult = [];
    }

    sendDataToMap(data) {
        this.dataVesselService.sendMessage(data);
    }

    ngOnInit() {
        this.query.valueChanges
            .pipe(
                startWith(null),
                debounceTime(800),
                distinctUntilChanged(),
                switchMap(value =>
                    this.autocompleteService.getAutocompleteResults(value)
                )
            )
            .subscribe((data: { places: any }) => {
                this.searchResult = [];
                this.searchResult = data.places;
            });
    }
}
