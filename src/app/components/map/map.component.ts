import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Subscription } from 'rxjs';
import { DataVesselService } from 'src/app/services/data-vessel.service';

declare let L;

const defaultIcon = L.icon({
    // specify the path here
    iconUrl: '/assets/images/marker-icon-green.png',
    shadowUrl: '/assets/images/marker-shadow.png',
    iconAnchor: [16, 37],
    popupAnchor: [-4, -28]
});

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    address: {};
    wardPolygon;
    map;
    info;
    marker;
    credit;
    subscription: Subscription;
    messages: any[] = [];

    constructor(
        private geolocationService: GeolocationService,
        private dataVesselService: DataVesselService
    ) {
        this.subscription = this.dataVesselService.getMessage().subscribe(data => {
            if (data) {

              this.drawPolygon(data);
            }
          });
    }

    private swap = (x, y) => {
        const b = [];
        b[0] = y;
        b[1] = x;
        return b;
    }

    private drawPolygon(address) {

        this.geolocationService
            .getWardAndZone(address.longitude, address.latitude)
            .subscribe((data: any) => {

                try {
                    if (this.map.hasLayer(this.wardPolygon)) {
                        this.map.removeLayer(this.wardPolygon);
                    }
                    this.wardPolygon = data;
                    // coordinates
                    const d = JSON.parse(data['ward area']);
                    const setUp = [];
                    for (const item of d.coordinates[0]) {
                        const da = this.swap(item[0], item[1]);
                        setUp.push(da);
                    }
                    this.wardPolygon = L.polygon(setUp).addTo(this.map);
                    this.addToMap(data, address);
                } catch (e) {
                    this.addToMap(data, address);
                }

            });
    }

    private addToMap(data?, address?) {

        if ( this.marker) {
            this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([address.latitude, address.longitude], { icon: defaultIcon})
        .addTo(this.map)
        .bindPopup(address.new_address)
        .openPopup();

        // info for markers
        this.info.onAdd = function() {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };
        this.info.update = function() {
            if (data.message) {
                this._div.innerHTML = `<h2>No Data Available<h2>`;
            } else {
                this._div.innerHTML =
                    `<h2>Ward No: ${data.ward}<h2>` +
                    `<h2>Zone No: ${data.zone}<h2>`;
            }
        };

        this.info.addTo(this.map);
        this.map.setView([address.latitude, address.longitude], 15);
    }

    ngOnInit() {
        this.map = L.map('map').setView([23.777176, 90.399452], 13);
        this.map.zoomControl.setPosition('bottomright');
        this.map.doubleClickZoom.disable();
        this.info = L.control();
        this.credit = L.control({position: 'bottomleft'});

        L.tileLayer(
            'https://map.barikoi.com/styles/klokantech-basic/{z}/{x}/{y}.png',
            {
                maxZoom: 18,
                attribution: `<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> |
        <a href="https://openmaptiles.org/">OpenMapTiles</a> |
        <a href="https://Barikoi.com">Barikoi</a>`,
                id: 'mapbox.streets',
            }
        ).addTo(this.map);

    }

}
