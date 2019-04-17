(function ($) {
    
    var PlaceLocator = function () {};
    window.PlaceLocator = PlaceLocator;
    PlaceLocator.toRad_ = function (a) {
        return a * Math.PI / 180
    };
    PlaceLocator.Feature = function (a, b) {
        this.id_ = a;
        this.name_ = b
    };
    PlaceLocator.Feature = PlaceLocator.Feature;
    PlaceLocator.Feature.prototype.getId = function () {
        return this.id_
    };
    PlaceLocator.Feature.prototype.getDisplayName = function () {
        return this.name_
    };
    PlaceLocator.Feature.prototype.toString = function () {
        return this.getDisplayName()
    };
    PlaceLocator.FeatureSet = function (a) {
        this.array_ = [];
        this.hash_ = {};
        for (var b = 0, c; c = arguments[b]; b++) this.add(c)
    };
    PlaceLocator.FeatureSet = PlaceLocator.FeatureSet;
    PlaceLocator.FeatureSet.prototype.toggle = function (a) {
        this.contains(a) ? this.remove(a) : this.add(a)
    };
    PlaceLocator.FeatureSet.prototype.contains = function (a) {
        return a.getId() in this.hash_
    };
    PlaceLocator.FeatureSet.prototype.getById = function (a) {
        return a in this.hash_ ? this.array_[this.hash_[a]] : null
    };
    PlaceLocator.FeatureSet.prototype.add = function (a) {
        a && (this.array_.push(a), this.hash_[a.getId()] = this.array_.length - 1)
    };
    PlaceLocator.FeatureSet.prototype.remove = function (a) {
        this.contains(a) && (this.array_[this.hash_[a.getId()]] = null, delete this.hash_[a.getId()])
    };
    PlaceLocator.FeatureSet.prototype.asList = function () {
        for (var a = [], b = 0, c = this.array_.length; b < c; b++) {
            var d = this.array_[b];
            null !== d && a.push(d)
        }
        return a
    };
    PlaceLocator.FeatureSet.NONE = new PlaceLocator.FeatureSet;
    PlaceLocator.GMEDataFeed = function (a) {
        this.tableId_ = a.tableId;
        this.apiKey_ = a.apiKey;
        a.propertiesModifier && (this.propertiesModifier_ = a.propertiesModifier)
    };
    PlaceLocator.GMEDataFeed = PlaceLocator.GMEDataFeed;
    PlaceLocator.GMEDataFeed.prototype.getplaces = function (a, b, c) {
        var d = this,
            e = a.getCenter();
        a = "(ST_INTERSECTS(geometry, " + this.boundsToWkt_(a) + ") OR ST_DISTANCE(geometry, " + this.latLngToWkt_(e) + ") \x3c 20000)";
        $.getJSON("https://www.googleapis.com/mapsengine/v1/tables/" + this.tableId_ + "/features?callback\x3d?", {
            key: this.apiKey_,
            where: a,
            version: "published",
            maxResults: 300
        }, function (a) {
            a = d.parse_(a);
            d.sortByDistance_(e, a);
            c(a)
        })
    };
    PlaceLocator.GMEDataFeed.prototype.latLngToWkt_ = function (a) {
        return "ST_POINT(" + a.lng() + ", " + a.lat() + ")"
    };
    PlaceLocator.GMEDataFeed.prototype.boundsToWkt_ = function (a) {
        var b = a.getNorthEast();
        a = a.getSouthWest();
        return ["ST_GEOMFROMTEXT('POLYGON ((", a.lng(), " ", a.lat(), ", ", b.lng(), " ", a.lat(), ", ", b.lng(), " ", b.lat(), ", ", a.lng(), " ", b.lat(), ", ", a.lng(), " ", a.lat(), "))')"].join("")
    };
    PlaceLocator.GMEDataFeed.prototype.parse_ = function (a) {
        if (a.error) return window.alert(a.error.message), [];
        a = a.features;
        if (!a) return [];
        for (var b = [], c = 0, d; d = a[c]; c++) {
            var e = d.geometry.coordinates,
                e = new google.maps.LatLng(e[1], e[0]);
            d = this.propertiesModifier_(d.properties);
            d = new PlaceLocator.place(d.id, e, null, d);
            b.push(d)
        }
        return b
    };
    PlaceLocator.GMEDataFeed.prototype.propertiesModifier_ = function (a) {
        return a
    };
    PlaceLocator.GMEDataFeed.prototype.sortByDistance_ = function (a, b) {
        b.sort(function (b, d) {
            return b.distanceTo(a) - d.distanceTo(a)
        })
    };
    PlaceLocator.GMEDataFeedOptions = function () {};
    PlaceLocator.Panel = function (a, b) {
        this.el_ = $(a);
        this.el_.addClass("PlaceLocator-panel");
        this.settings_ = $.extend({
            locationSearch: !0,
            locationSearchLabel: "Where are you?",
            featureFilter: !0,
            directions: !0,
            view: null
        }, b);
        this.directionsRenderer_ = new google.maps.DirectionsRenderer({
            draggable: !0
        });
        this.directionsService_ = new google.maps.DirectionsService;
        this.init_()
    };
    PlaceLocator.Panel = PlaceLocator.Panel;
    PlaceLocator.Panel.prototype = new google.maps.MVCObject;
    PlaceLocator.Panel.prototype.init_ = function () {
        var a = this;
        this.itemCache_ = {};
        this.settings_.view && this.set("view", this.settings_.view);
        this.filter_ = $('\x3cform class\x3d"PlaceLocator-filter"/\x3e');
        this.el_.append(this.filter_);
        this.settings_.locationSearch && (this.locationSearch_ = $('\x3cdiv class\x3d"location-search"\x3e\x3ch4\x3e' + this.settings_.locationSearchLabel + "\x3c/h4\x3e\x3cinput\x3e\x3c/div\x3e"), this.filter_.append(this.locationSearch_), "undefined" != typeof google.maps.places ? this.initAutocomplete_() :
            this.filter_.submit(function () {
                var b = $("input", a.locationSearch_).val();
                a.searchPosition(b)
            }), this.filter_.submit(function () {
                return !1
            }), google.maps.event.addListener(this, "geocode", function (b) {
                if (b.geometry) {
                    this.directionsFrom_ = b.geometry.location;
                    a.directionsVisible_ && a.renderDirections_();
                    var c = a.get("view");
                    c.highlight(null);
                    var d = c.getMap();
                    b.geometry.viewport ? d.fitBounds(b.geometry.viewport) : (d.setCenter(b.geometry.location), d.setZoom(13));
                    c.refreshView();
                    a.listenForplacesUpdate_()
                } else a.searchPosition(b.name)
            }));
        if (this.settings_.featureFilter) {
            this.featureFilter_ = $('\x3cdiv class\x3d"feature-filter"/\x3e');
            for (var b = this.get("view").getFeatures().asList(), c = 0, d = b.length; c < d; c++) {
                var e = b[c],
                    f = $('\x3cinput type\x3d"checkbox"/\x3e');
                f.data("feature", e);
                $("\x3clabel/\x3e").append(f).append(e.getDisplayName()).appendTo(this.featureFilter_)
            }
            this.filter_.append(this.featureFilter_);
            this.featureFilter_.find("input").change(function () {
                var b = $(this).data("feature");
                a.toggleFeatureFilter_(b);
                a.get("view").refreshView()
            })
        }
        this.placeList_ =
            $('\x3cul class\x3d"place-list"/\x3e');
        this.el_.append(this.placeList_);
        this.settings_.directions && (this.directionsPanel_ = $('\x3cdiv class\x3d"directions-panel"\x3e\x3cform\x3e\x3cinput class\x3d"directions-to"/\x3e\x3cinput type\x3d"submit" value\x3d"Find directions"/\x3e\x3ca href\x3d"#" class\x3d"close-directions"\x3eClose\x3c/a\x3e\x3c/form\x3e\x3cdiv class\x3d"rendered-directions"\x3e\x3c/div\x3e\x3c/div\x3e'), this.directionsPanel_.find(".directions-to").attr("readonly", "readonly"), this.directionsPanel_.hide(),
            this.directionsVisible_ = !1, this.directionsPanel_.find("form").submit(function () {
                a.renderDirections_();
                return !1
            }), this.directionsPanel_.find(".close-directions").click(function () {
                a.hideDirections()
            }), this.el_.append(this.directionsPanel_))
    };
    PlaceLocator.Panel.prototype.toggleFeatureFilter_ = function (a) {
        var b = this.get("featureFilter");
        b.toggle(a);
        this.set("featureFilter", b)
    };
    PlaceLocator.geocoder_ = new google.maps.Geocoder;
    PlaceLocator.Panel.prototype.listenForplacesUpdate_ = function () {
        var a = this,
            b = this.get("view");
        this.placesChangedListener_ && google.maps.event.removeListener(this.placesChangedListener_);
        this.placesChangedListener_ = google.maps.event.addListenerOnce(b, "places_changed", function () {
            a.set("places", b.get("places"))
        })
    };
    PlaceLocator.Panel.prototype.searchPosition = function (a) {
        var b = this;
        a = {
            address: a,
            bounds: this.get("view").getMap().getBounds()
        };
        PlaceLocator.geocoder_.geocode(a, function (a, d) {
            d == google.maps.GeocoderStatus.OK && google.maps.event.trigger(b, "geocode", a[0])
        })
    };
    PlaceLocator.Panel.prototype.setView = function (a) {
        this.set("view", a)
    };
    PlaceLocator.Panel.prototype.view_changed = function () {
        var a = this.get("view");
        this.bindTo("selectedplace", a);
        var b = this;
        this.geolocationListener_ && google.maps.event.removeListener(this.geolocationListener_);
        this.zoomListener_ && google.maps.event.removeListener(this.zoomListener_);
        this.idleListener_ && google.maps.event.removeListener(this.idleListener_);
        a.getMap().getCenter();
        var c = function () {
            a.clearMarkers();
            b.listenForplacesUpdate_()
        };
        this.geolocationListener_ = google.maps.event.addListener(a, "load",
            c);
        this.zoomListener_ = google.maps.event.addListener(a.getMap(), "zoom_changed", c);
        this.idleListener_ = google.maps.event.addListener(a.getMap(), "idle", function () {
            return b.idle_(a.getMap())
        });
        c();
        this.bindTo("featureFilter", a);
        this.autoComplete_ && this.autoComplete_.bindTo("bounds", a.getMap())
    };
    PlaceLocator.Panel.prototype.initAutocomplete_ = function () {
        var a = this,
            b = $("input", this.locationSearch_)[0];
        this.autoComplete_ = new google.maps.places.Autocomplete(b);
        this.get("view") && this.autoComplete_.bindTo("bounds", this.get("view").getMap());
        google.maps.event.addListener(this.autoComplete_, "place_changed", function () {
            google.maps.event.trigger(a, "geocode", this.getPlace())
        })
    };
    PlaceLocator.Panel.prototype.idle_ = function (a) {
        this.center_ ? a.getBounds().contains(this.center_) || (this.center_ = a.getCenter(), this.listenForplacesUpdate_()) : this.center_ = a.getCenter()
    };
    PlaceLocator.Panel.NO_placeS_HTML_ = '\x3cli class\x3d"no-places"\x3eThere are no places in this area.\x3c/li\x3e';
    PlaceLocator.Panel.NO_placeS_IN_VIEW_HTML_ = '\x3cli class\x3d"no-places"\x3eThere are no places in this area. However, places closest to you are listed below.\x3c/li\x3e';
    PlaceLocator.Panel.prototype.places_changed = function () {
        if (this.get("places")) {
            var a = this.get("view"),
                b = a && a.getMap().getBounds(),
                c = this.get("places"),
                d = this.get("selectedplace");
            this.placeList_.empty();
            c.length ? b && !b.contains(c[0].getLocation()) && this.placeList_.append(PlaceLocator.Panel.NO_placeS_IN_VIEW_HTML_) : this.placeList_.append(PlaceLocator.Panel.NO_placeS_HTML_);
            for (var b = function () {
                    a.highlight(this.place, !0)
                }, e = 0, f = Math.min(10, c.length); e < f; e++) {
                var g = c[e].getInfoPanelItem();
                g.place = c[e];
                d && c[e].getId() == d.getId() && $(g).addClass("highlighted");
                g.clickHandler_ || (g.clickHandler_ = google.maps.event.addDomListener(g, "click", b));
                this.placeList_.append(g)
            }
        }
    };
    PlaceLocator.Panel.prototype.selectedplace_changed = function () {
        $(".highlighted", this.placeList_).removeClass("highlighted");
        var a = this,
            b = this.get("selectedplace");
        if (b) {
            this.directionsTo_ = b;
            this.placeList_.find("#place-" + b.getId()).addClass("highlighted");
            this.settings_.directions && this.directionsPanel_.find(".directions-to").val(b.getDetails().title);
            var c = a.get("view").getInfoWindow().getContent(),
                d = $("\x3ca/\x3e").text("Directions").attr("href", "#").addClass("action").addClass("directions"),
                e = $("\x3ca/\x3e").text("Zoom here").attr("href",
                    "index.php?cPath=place_locator#").addClass("action").addClass("zoomhere"),
                f = $("\x3ca/\x3e").text("Street view").attr("href", "index.php?cPath=place_locator#").addClass("action").addClass("streetview");
            d.click(function () {
                a.showDirections();
                return !1
            });
            e.click(function () {
                a.get("view").getMap().setOptions({
                    center: b.getLocation(),
                    zoom: 16
                })
            });
            f.click(function () {
                var c = a.get("view").getMap().getStreetView();
                c.setPosition(b.getLocation());
                c.setVisible(!0)
            });
            $(c).append(d).append(e).append(f)
        }
    };
    PlaceLocator.Panel.prototype.hideDirections = function () {
        this.directionsVisible_ = !1;
        this.directionsPanel_.fadeOut();
        this.featureFilter_.fadeIn();
        this.placeList_.fadeIn();
        this.directionsRenderer_.setMap(null)
    };
    PlaceLocator.Panel.prototype.showDirections = function () {
        var a = this.get("selectedplace");
        this.featureFilter_.fadeOut();
        this.placeList_.fadeOut();
        this.directionsPanel_.find(".directions-to").val(a.getDetails().title);
        this.directionsPanel_.fadeIn();
        this.renderDirections_();
        this.directionsVisible_ = !0
    };
    PlaceLocator.Panel.prototype.renderDirections_ = function () {
        var a = this;
        if (this.directionsFrom_ && this.directionsTo_) {
            var b = this.directionsPanel_.find(".rendered-directions").empty();
            this.directionsService_.route({
                origin: this.directionsFrom_,
                destination: this.directionsTo_.getLocation(),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, function (c, d) {
                if (d == google.maps.DirectionsStatus.OK) {
                    var e = a.directionsRenderer_;
                    e.setPanel(b[0]);
                    e.setMap(a.get("view").getMap());
                    e.setDirections(c)
                }
            })
        }
    };
    PlaceLocator.Panel.prototype.featureFilter_changed = function () {
        this.listenForplacesUpdate_()
    };
    PlaceLocator.PanelOptions = function () {};
    PlaceLocator.StaticDataFeed = function () {
        this.places_ = []
    };
    PlaceLocator.StaticDataFeed = PlaceLocator.StaticDataFeed;
    PlaceLocator.StaticDataFeed.prototype.setplaces = function (a) {
        this.places_ = a;
        this.firstCallback_ ? this.firstCallback_() : delete this.firstCallback_
    };
    PlaceLocator.StaticDataFeed.prototype.getplaces = function (a, b, c) {
        if (this.places_.length) {
            for (var d = [], e = 0, f; f = this.places_[e]; e++) f.hasAllFeatures(b) && d.push(f);
            this.sortByDistance_(a.getCenter(), d);
            c(d)
        } else {
            var g = this;
            this.firstCallback_ = function () {
                g.getplaces(a, b, c)
            }
        }
    };
    PlaceLocator.StaticDataFeed.prototype.sortByDistance_ = function (a, b) {
        b.sort(function (b, d) {
            return b.distanceTo(a) - d.distanceTo(a)
        })
    };
    /*

      Latitude/longitude spherical geodesy formulae & scripts
      (c) Chris Veness 2002-2010
      www.movable-type.co.uk/scripts/latlong.html
    */
    PlaceLocator.place = function (a, b, c, d) {
        this.id_ = a;
        this.location_ = b;
        this.features_ = c || PlaceLocator.FeatureSet.NONE;
        this.props_ = d || {}
    };
    PlaceLocator.place = PlaceLocator.place;
    PlaceLocator.place.prototype.setMarker = function (a) {
        this.marker_ = a;
        google.maps.event.trigger(this, "marker_changed", a)
    };
    PlaceLocator.place.prototype.getMarker = function () {
        return this.marker_
    };
    PlaceLocator.place.prototype.getId = function () {
        return this.id_
    };
    PlaceLocator.place.prototype.getLocation = function () {
        return this.location_
    };
    PlaceLocator.place.prototype.getFeatures = function () {
        return this.features_
    };
    PlaceLocator.place.prototype.hasFeature = function (a) {
        return this.features_.contains(a)
    };
    PlaceLocator.place.prototype.hasAllFeatures = function (a) {
        if (!a) return !0;
        a = a.asList();
        for (var b = 0, c = a.length; b < c; b++)
            if (!this.hasFeature(a[b])) return !1;
        return !0
    };
    PlaceLocator.place.prototype.getDetails = function () {
        return this.props_
    };
    PlaceLocator.place.prototype.generateFieldsHTML_ = function (a) {
        for (var b = [], c = 0, d = a.length; c < d; c++) {
            var e = a[c];
            this.props_[e] && (b.push('\x3cdiv class\x3d"'), b.push(e), b.push('"\x3e'), b.push(this.props_[e]), b.push("\x3c/div\x3e"))
        }
        return b.join("")
    };
    PlaceLocator.place.prototype.generateFeaturesHTML_ = function () {
        var a = [];
        a.push('\x3cul class\x3d"features"\x3e');
        for (var b = this.features_.asList(), c = 0, d; d = b[c]; c++) a.push("\x3cli\x3e"), a.push(d.getDisplayName()), a.push("\x3c/li\x3e");
        a.push("\x3c/ul\x3e");
        return a.join("")
    };
    PlaceLocator.place.prototype.getInfoWindowContent = function () {
        if (!this.content_) {
            var a = ['\x3cdiv class\x3d"place"\x3e'];
            a.push(this.generateFieldsHTML_(["title", "address", "phone", "misc", "web"]));
            a.push(this.generateFeaturesHTML_());
            a.push("\x3c/div\x3e");
            this.content_ = a.join("")
        }
        return this.content_
    };
    PlaceLocator.place.prototype.getInfoPanelContent = function () {
        return this.getInfoWindowContent()
    };
    PlaceLocator.place.infoPanelCache_ = {};
    PlaceLocator.place.prototype.getInfoPanelItem = function () {
        var a = PlaceLocator.place.infoPanelCache_,
            b = this.getId();
        if (!a[b]) {
            var c = this.getInfoPanelContent();
            a[b] = $('\x3cli class\x3d"place" id\x3d"place-' + this.getId() + '"\x3e' + c + "\x3c/li\x3e")[0]
        }
        return a[b]
    };
    PlaceLocator.place.prototype.distanceTo = function (a) {
        var b = this.getLocation(),
            c = PlaceLocator.toRad_(b.lat()),
            d = PlaceLocator.toRad_(b.lng()),
            b = PlaceLocator.toRad_(a.lat()),
            e = PlaceLocator.toRad_(a.lng());
        a = b - c;
        d = e - d;
        c = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(c) * Math.cos(b) * Math.sin(d / 2) * Math.sin(d / 2);
        return 12742 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    };
    PlaceLocator.DataFeed = function () {};
    PlaceLocator.DataFeed = PlaceLocator.DataFeed;
    PlaceLocator.DataFeed.prototype.getplaces = function (a, b, c) {};
    PlaceLocator.View = function (a, b, c) {
        this.map_ = a;
        this.data_ = b;
        this.settings_ = $.extend({
            updateOnPan: !0,
            geolocation: !0,
            features: new PlaceLocator.FeatureSet
        }, c);
        this.init_();
        google.maps.event.trigger(this, "load");
        this.set("featureFilter", new PlaceLocator.FeatureSet)
    };
    PlaceLocator.View = PlaceLocator.View;
    PlaceLocator.View.prototype = new google.maps.MVCObject;
    PlaceLocator.View.prototype.geolocate_ = function () {
        var a = this;
        window.navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition(function (b) {
            b = new google.maps.LatLng(b.coords.latitude, b.coords.longitude);
            a.getMap().setCenter(b);
            a.getMap().setZoom(11);
            google.maps.event.trigger(a, "load")
        }, void 0, {
            maximumAge: 6E4,
            timeout: 1E4
        })
    };
    PlaceLocator.View.prototype.init_ = function () {
        this.settings_.geolocation && this.geolocate_();
        this.markerCache_ = {};
        this.infoWindow_ = new google.maps.InfoWindow;
        var a = this,
            b = this.getMap();
        this.set("updateOnPan", this.settings_.updateOnPan);
        google.maps.event.addListener(this.infoWindow_, "closeclick", function () {
            a.highlight(null)
        });
        google.maps.event.addListener(b, "click", function () {
            a.highlight(null);
            a.infoWindow_.close()
        })
    };
    PlaceLocator.View.prototype.updateOnPan_changed = function () {
        this.updateOnPanListener_ && google.maps.event.removeListener(this.updateOnPanListener_);
        if (this.get("updateOnPan") && this.getMap()) {
            var a = this,
                b = this.getMap();
            this.updateOnPanListener_ = google.maps.event.addListener(b, "idle", function () {
                a.refreshView()
            })
        }
    };
    PlaceLocator.View.prototype.addplaceToMap = function (a) {
        var b = this.getMarker(a);
        a.setMarker(b);
        var c = this;
        b.clickListener_ = google.maps.event.addListener(b, "click", function () {
            c.highlight(a, !1)
        });
        b.getMap() != this.getMap() && b.setMap(this.getMap())
    };
    PlaceLocator.View.prototype.createMarker = function (a) {
        a = {
            position: a.getLocation()
        };
        var b = this.settings_.markerIcon;
        b && (a.icon = b);
        return new google.maps.Marker(a)
    };
    PlaceLocator.View.prototype.getMarker = function (a) {
        var b = this.markerCache_,
            c = a.getId();
        b[c] || (b[c] = this.createMarker(a));
        return b[c]
    };
    PlaceLocator.View.prototype.getInfoWindow = function (a) {
        if (!a) return this.infoWindow_;
        a = $(a.getInfoWindowContent());
        this.infoWindow_.setContent(a[0]);
        return this.infoWindow_
    };
    PlaceLocator.View.prototype.getFeatures = function () {
        return this.settings_.features
    };
    PlaceLocator.View.prototype.getFeatureById = function (a) {
        if (!this.featureById_) {
            this.featureById_ = {};
            for (var b = 0, c; c = this.settings_.features[b]; b++) this.featureById_[c.getId()] = c
        }
        return this.featureById_[a]
    };
    PlaceLocator.View.prototype.featureFilter_changed = function () {
        google.maps.event.trigger(this, "featureFilter_changed", this.get("featureFilter"));
        this.get("places") && this.clearMarkers()
    };
    PlaceLocator.View.prototype.clearMarkers = function () {
        for (var a in this.markerCache_) {
            this.markerCache_[a].setMap(null);
            var b = this.markerCache_[a].clickListener_;
            b && google.maps.event.removeListener(b)
        }
    };
    PlaceLocator.View.prototype.refreshView = function () {
        var a = this;
        this.data_.getplaces(this.getMap().getBounds(), this.get("featureFilter"), function (b) {
            var c = a.get("places");
            if (c)
                for (var d = 0, e = c.length; d < e; d++) google.maps.event.removeListener(c[d].getMarker().clickListener_);
            a.set("places", b)
        })
    };
    PlaceLocator.View.prototype.places_changed = function () {
        for (var a = this.get("places"), b = 0, c; c = a[b]; b++) this.addplaceToMap(c)
    };
    PlaceLocator.View.prototype.getMap = function () {
        return this.map_
    };
    PlaceLocator.View.prototype.highlight = function (a, b) {
        var c = this.getInfoWindow(a);
        a ? (c = this.getInfoWindow(a), a.getMarker() ? c.open(this.getMap(), a.getMarker()) : (c.setPosition(a.getLocation()), c.open(this.getMap())), b && this.getMap().panTo(a.getLocation()), this.getMap().getStreetView().getVisible() && this.getMap().getStreetView().setPosition(a.getLocation())) : c.close();
        this.set("selectedplace", a)
    };
    PlaceLocator.View.prototype.selectedplace_changed = function () {
        google.maps.event.trigger(this, "selectedplace_changed", this.get("selectedplace"))
    };
    PlaceLocator.ViewOptions = function () {};
})(jQuery);
