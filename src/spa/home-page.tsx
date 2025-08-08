// React and hooks
import React, { useRef, useEffect, useState } from 'react';

// MUI components
import Box from '@mui/material/Box';

// OpenLayers core
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';

// OpenLayers layers & sources
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

// OpenLayers styles
import { Style, Stroke, Fill, Icon } from 'ol/style';
import type Point from 'ol/geom/Point';

// Local components
import SearchDialog from './components/search-dialog';
import SearchResults from './components/search-results';
import CoffeeShopPopup from './components/coffee-shop-popup';


// Local resources
import { HomeAddressResource, NeighborhoodResource, CoffeeShopResource } from './resources';

export default function HomePage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  const [addressLayer, setAddressLayer] = useState<VectorLayer<any> | null>(null);
  const [coffeeLayer, setCoffeeLayer] = useState<VectorLayer<any> | null>(null);
  const [neighborhoodLayer, setNeighborhoodLayer] = useState<VectorLayer<any> | null>(null);

  const [address, setAddress] = useState<HomeAddressResource | null>(null);
  const [neighborhood, setNeighborhood] = useState<NeighborhoodResource | null>(null);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShopResource[]>([]);
  const [showDialog, setShowDialog] = useState(true);
  const [popupInfo, setPopupInfo] = useState<{ coordinate: number[]; properties: any } | null>(null);
  const popupInfoRef = useRef<{ coordinate: number[]; properties: any } | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);
  const popupOverlayRef = useRef<Overlay | null>(null);

  // Keep popupInfoRef in sync with popupInfo
  useEffect(() => {
    popupInfoRef.current = popupInfo;
  }, [popupInfo]);

  // Manage OpenLayers Overlay for popup
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!popupContainerRef.current) return;

    // Create overlay if not already
    if (!popupOverlayRef.current) {
      popupOverlayRef.current = new Overlay({
        element: popupContainerRef.current,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      mapInstance.current.addOverlay(popupOverlayRef.current);
    }

    // Show/hide and set position
    if (popupInfo) {
      popupOverlayRef.current.setPosition(popupInfo.coordinate);
      popupContainerRef.current.style.display = '';
    } else {
      popupOverlayRef.current.setPosition(undefined);
      popupContainerRef.current.style.display = 'none';
    }

    // Cleanup overlay on unmount
    return () => {
      if (popupOverlayRef.current) {
        mapInstance.current?.removeOverlay(popupOverlayRef.current);
        popupOverlayRef.current = null;
      }
    };
  }, [popupInfo]);

  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = new TileLayer({ source: new OSM() });

    const neighborhood = new VectorLayer({
      source: new VectorSource({ features: [] }),
      style: new Style({
        stroke: new Stroke({ color: 'rgb(144, 174, 238)', width: 4 }),
        fill: new Fill({ color: 'rgba(144, 174, 238, 0.35)' }),
      }),
    });
    neighborhood.set('id', 'home-neighborhood');

    const address = new VectorLayer({
      source: new VectorSource({ features: [] }),
      style: new Style({
        image: new Icon({
          src: '/icons/home-blue.svg',
          scale: 1,
        }),
      }),
    });
    address.set('id', 'home-address');

    const coffee = new VectorLayer({
      source: new VectorSource({ features: [] }),
      style: new Style({
        image: new Icon({
          src: '/icons/coffee-blue.svg',
          scale: 1,
        }),
      }),
    });
    coffee.set('id', 'coffee-shops');

    setNeighborhoodLayer(neighborhood);
    setAddressLayer(address);
    setCoffeeLayer(coffee);

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, neighborhood, address, coffee],
      view: new View({ center: fromLonLat([-71.0589, 42.3601]), zoom: 12 }),
    });

    mapInstance.current = map;

    // Add click handler for coffee shop features
    map.on('singleclick', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
        if (layer?.get('id') === 'coffee-shops') {
          if (feat) {
            return feat;
          }
        }
        return false;
      }, { hitTolerance: 10 });

      if (feature) {
        const props = (feature as any)?.values_ || {};
        setPopupInfo({ coordinate: evt.coordinate, properties: props });
      } else {
        setPopupInfo(null);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []); 

  const reset = () => {
    setAddress(null);
    setNeighborhood(null);
    setCoffeeShops([]);

    addressLayer?.setSource(new VectorSource({ features: [] }));
    coffeeLayer?.setSource(new VectorSource({ features: [] }));
    neighborhoodLayer?.setSource(new VectorSource({ features: [] }));

    setShowDialog(true);
  };

  const handleSearch = async (query: string) => {
    try {
      const geocodeUrl = `/api/geocode?q=${encodeURIComponent(query)}`;
      setShowDialog(false);

      const source = new VectorSource({
        url: geocodeUrl,
        format: new GeoJSON()
      });
      source.once('featuresloadend', () => {
        const features = source.getFeatures();
        if (!features || features.length === 0) {
          throw new Error('No address feature found');
        }
        const f = features[0];
        const coords = (f.getGeometry() as Point).getCoordinates();
        const [lon, lat] = toLonLat(coords);
        const props = f.getProperties();
        setAddress(new HomeAddressResource(lat, lon, props.address?.formattedAddress || ''));
      });
      addressLayer?.setSource(source);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Effect to fetch neighborhood and coffee shops when address changes
  useEffect(() => {
    if (!address || !addressLayer) return;
    const { latitude, longitude } = address;
    const coffeeUrl = `/api/coffee/find?lon=${longitude}&lat=${latitude}`;
    const hoodUrl = `/api/neighborhoods/find?lon=${longitude}&lat=${latitude}`;

    // Coffee shops
    const coffeeSource = new VectorSource({ 
      url: coffeeUrl, 
      format: new GeoJSON()
    });
    coffeeSource.once('featuresloadend', () => {
      const features = coffeeSource.getFeatures();
      setCoffeeShops(features.map(f => {
        const p = f.getProperties();
        return new CoffeeShopResource(
          p.name || '',
          p.address || '',
          p.phone || '',
          p.categories || [],
          typeof p.rank === 'number' ? p.rank : 0,
          p.url || ''
        );
      }));
    });
    coffeeLayer?.setSource(coffeeSource);

    // Neighborhood
    const neighborhoodSource = new VectorSource({
      url: hoodUrl,
      format: new GeoJSON()
    });
    neighborhoodSource.once('featuresloadend', () => {
      const features = neighborhoodSource.getFeatures();
      if (features && features.length > 0) {
        const p = features[0].getProperties();
        setNeighborhood(new NeighborhoodResource(p.name || '', p.description || ''));
        // Fit map to neighborhood
        const geometry = features[0].getGeometry();
        if (geometry) {
          mapInstance.current?.getView().fit(geometry.getExtent(), { padding: [40, 40, 40, 40] });
        }
      }
    });
    neighborhoodLayer?.setSource(neighborhoodSource);
  }, [address, addressLayer, coffeeLayer, neighborhoodLayer]);

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
      {/* OpenLayers Overlay Popup Container */}
      <div ref={popupContainerRef} style={{ position: 'absolute', zIndex: 10, pointerEvents: 'auto', minWidth: 220, display: 'none' }}>
        {popupInfo && (
          <CoffeeShopPopup
            popupInfo={popupInfo}
            onClose={() => setPopupInfo(null)}
          />
        )}
      </div>
      {showDialog && <SearchDialog onSearch={handleSearch} />}
      {!showDialog && address && neighborhood && (
        <SearchResults
          address={address}
          neighborhood={neighborhood}          
          onReset={reset}
        />
      )}
    </Box>
  );
}
