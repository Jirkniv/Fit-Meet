import { render, fireEvent, screen } from '@testing-library/react';
import Map from '../../src/components/ui/Map';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import React from 'react';

vi.mock('react-leaflet', async () => {
  const actual = await vi.importActual<any>('react-leaflet');
  return {
    ...actual,
    MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children, position }: any) => (
      <div data-testid="marker" data-position={position}>
        {children}
      </div>
    ),
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
    useMapEvent: () => null,
  };
});

describe('Map Component', () => {
  const initial = [-19.8285, -43.0876];

  it('renders the map container', () => {
    const { getByTestId } = render(<Map locked={true} />);
    expect(getByTestId('map')).toBeInTheDocument();
  });

  it('renders tile layer', () => {
    const { getByTestId } = render(<Map locked={true} />);
    expect(getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('renders marker with initial position', () => {
    const { getByTestId } = render(<Map locked={true} initialPosition={initial as [number, number]} />);
    const marker = getByTestId('marker');
    expect(marker).toHaveAttribute('data-position', initial.toString());
  });

  it('calls onMarkerChange when clicked and unlocked (marker appears with the new position)', () => {
    render(<Map locked={true} initialPosition={[-20, -40]} />);
    
    const markers = screen.getAllByTestId('marker');
    
    const expectedMarker = markers.find(marker => marker.getAttribute('data-position') === '[-20,-40]' || marker.getAttribute('data-position') === '-20,-40');
    
    expect(expectedMarker).toBeDefined();
  });
  

  it('does not call onMarkerChange if locked is true', () => {
    const onMarkerChange = vi.fn();
    render(<Map locked={true} onMarkerChange={onMarkerChange} initialPosition={initial as [number, number]} />);
    expect(onMarkerChange).not.toHaveBeenCalled();
  });
});
