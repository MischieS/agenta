// Type definitions for leaflet
// Project: https://leafletjs.com

declare module 'leaflet' {
  // Core classes and types
  export const Map: {
    new (element: string | HTMLElement, options?: MapOptions): IMap;
  };
  
  export const tileLayer: (urlTemplate: string, options?: TileLayerOptions) => TileLayer;
  export const marker: (latlng: LatLngExpression, options?: MarkerOptions) => Marker;
  export const icon: (options: IconOptions) => Icon;
  export const divIcon: (options?: DivIconOptions) => DivIcon;
  export const popup: (options?: PopupOptions, source?: Layer) => Popup;
  export const layerGroup: <T extends Layer = Layer>(layers?: T[]) => LayerGroup<T>;
  export const featureGroup: <T extends Layer = Layer>(layers?: T[]) => FeatureGroup<T>;
  export const control: {
    layers: (baseLayers?: any, overlays?: any, options?: Control.LayersOptions) => Control.Layers;
  };

  // Basic types
  export type LatLngExpression = LatLng | [number, number];
  export type LatLngBoundsExpression = LatLngBounds | [LatLngExpression, LatLngExpression];
  export type Layer = any; // Simplified for brevity

  // Interfaces
  export interface IMap {
    // Map state methods
    setView(center: LatLngExpression, zoom?: number, options?: ZoomPanOptions): this;
    setZoom(zoom: number, options?: ZoomPanOptions): this;
    getZoom(): number;
    getBounds(): LatLngBounds;
    
    // Layer management
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    hasLayer(layer: Layer): boolean;
    
    // Map controls
    addControl(control: Control): this;
    removeControl(control: Control): this;
    
    // Viewport
    fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;
    invalidateSize(animate?: boolean): this;
    
    // Event handling
    on(type: string, fn: (e: any) => void, context?: any): this;
    off(type?: string, fn?: (e: any) => void, context?: any): this;
    
    // Utility methods
    getContainer(): HTMLElement;
    getCenter(): LatLng;
    getSize(): Point;
    
    // Cleanup
    remove(): void;
    
    // Properties (marked as readonly to match Leaflet's API)
    readonly options: MapOptions;
    readonly container: HTMLElement;
  }

  export interface TileLayer extends Layer {
    // TileLayer methods
    setUrl(url: string, noRedraw?: boolean): this;
    // ... other tile layer methods
  }

  export interface Marker extends Layer {
    // Marker methods
    setLatLng(latlng: LatLngExpression): this;
    getLatLng(): LatLng;
    // ... other marker methods
  }

  export interface Icon<T extends BaseIconOptions = IconOptions> {
    // Icon methods and properties
    options: T;
    createIcon(oldIcon?: HTMLElement): HTMLElement;
    createShadow(oldIcon?: HTMLElement): HTMLElement | undefined;
  }

  export interface DivIcon extends Icon<DivIconOptions> {}

  export interface Popup extends Layer {
    // Popup methods
    setLatLng(latlng: LatLngExpression): this;
    setContent(htmlContent: string | HTMLElement): this;
    // ... other popup methods
  }

  export interface LayerGroup<T extends Layer = Layer> extends Layer {
    // LayerGroup methods
    addLayer(layer: T): this;
    removeLayer(layer: T | string | number): this;
    // ... other layer group methods
  }

  export interface FeatureGroup<T extends Layer = Layer> extends LayerGroup<T> {
    // FeatureGroup methods
    // ...
  }

  export namespace Control {
    export interface LayersOptions {
      // Layers control options
      // ...
    }

    export interface Layers {
      // Layers control methods
      // ...
    }
  }

  // Options interfaces
  export interface MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    layers?: Layer[];
    // ... other map options
  }

  export interface TileLayerOptions {
    // Tile layer options
    minZoom?: number;
    maxZoom?: number;
    // ... other tile layer options
  }

  export interface MarkerOptions extends InteractiveLayerOptions {
    // Marker options
    icon?: Icon | DivIcon;
    // ... other marker options
  }

  export interface IconOptions extends BaseIconOptions {
    // Icon options
    iconUrl: string;
    iconRetinaUrl?: string;
    iconSize?: PointExpression;
    iconAnchor?: PointExpression;
    popupAnchor?: PointExpression;
    shadowUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: PointExpression;
    shadowAnchor?: PointExpression;
    className?: string;
  }

  export interface DivIconOptions extends BaseIconOptions {
    // DivIcon options
    html?: string | false;
    bgPos?: PointExpression;
    iconSize?: PointExpression;
    iconAnchor?: PointExpression;
    popupAnchor?: PointExpression;
    className?: string;
  }

  export interface BaseIconOptions extends LayerOptions {
    // Base icon options
    className?: string;
  }

  export interface PopupOptions extends DivOverlayOptions {
    // Popup options
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    autoPan?: boolean;
    // ... other popup options
  }

  export interface DivOverlayOptions extends LayerOptions {
    // DivOverlay options
    offset?: PointExpression;
    zoomAnimation?: boolean;
    // ... other div overlay options
  }

  export interface LayerOptions {
    // Layer options
    pane?: string;
    attribution?: string;
    // ... other layer options
  }

  export interface InteractiveLayerOptions extends LayerOptions {
    // Interactive layer options
    interactive?: boolean;
    // ... other interactive layer options
  }

  export interface ZoomPanOptions {
    // Zoom/pan options
    animate?: boolean;
    // ... other zoom/pan options
  }

  export interface FitBoundsOptions extends ZoomPanOptions {
    // Fit bounds options
    paddingTopLeft?: PointExpression;
    paddingBottomRight?: PointExpression;
    padding?: PointExpression;
    maxZoom?: number;
    // ... other fit bounds options
  }

  // Basic geometry types
  export class LatLng {
    constructor(lat: number, lng: number, alt?: number);
    lat: number;
    lng: number;
    alt?: number;
    equals(otherLatLng: LatLngExpression, maxMargin?: number): boolean;
    // ... other LatLng methods
  }

  export class LatLngBounds {
    constructor(southWest: LatLngExpression, northEast: LatLngExpression);
    extend(latlng: LatLngExpression): this;
    getCenter(): LatLng;
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
    getNorthWest(): LatLng;
    getSouthEast(): LatLng;
    contains(bounds: LatLngBounds | LatLngExpression): boolean;
    intersects(otherBounds: LatLngBounds): boolean;
    // ... other LatLngBounds methods
  }

  export type PointExpression = Point | [number, number];

  export class Point {
    constructor(x: number, y: number, round?: boolean);
    x: number;
    y: number;
    add(otherPoint: PointExpression): Point;
    subtract(otherPoint: PointExpression): Point;
    multiplyBy(number: number): Point;
    divideBy(number: number, round?: boolean): Point;
    distanceTo(otherPoint: PointExpression): number;
    equals(otherPoint: PointExpression): boolean;
    contains(otherPoint: PointExpression): boolean;
    // ... other Point methods
  }
}
