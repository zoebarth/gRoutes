import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './RouteView.module.css';

import Map from './map/Map.js';
import Route from './route/Route.js';
import OptimizeButton from './route/OptimizeButton.js';
import SaveButton from './route/SaveButton.js';
import TripName from './trip-name/TripName.js';

import { MOCK_DATA } from './route/mockData.js';

/**
 * Render the route page with list of locations in order and directions on a map between the locations.
 */
function RouteView() {
  const [isOptimized, setIsOptimized] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  // const [places, setPlaces] = useState(MOCK_DATA);
  const [optimizedOrder, setOptimizedOrder] = useState(null);

  const urlParameters = useLocation();
  const query = getQueryParameters(urlParameters.search);
  console.log(urlParameters);
  console.log(query);
  const history = useHistory();
  const tripObject = JSON.parse(decodeURIComponent(query.trip));
  console.log("trip obj: ")
  console.log(tripObject)
  const [attractions, setAttractions] = useState(tripObject.selectedAttractions);

  /**
   * Extract the url parameters and convert to dictionary
   * @param {string} query url string
   * @return {object} key value pair of url parameters
   */
  function getQueryParameters(query) {
    const params = query.split('?')[1];
    return Object.fromEntries(new URLSearchParams(params));
  }

  useEffect(() => {
    if (isOptimized) {
      setAttractions(optimizedOrder);
    }
  }, [isOptimized, optimizedOrder]);

  async function optimize() {
    if (!optimizedOrder) {
      const response = await fetch('/api/v1/optimize', {
        method: 'POST',
        body: JSON.stringify({ attractions: attractions }),
      });
      const json = await response.json();
      setOptimizedOrder(json);
    }
    setIsOptimized(true);
  }

  function save() {
    setIsSaved(true);
    // save to back end database
  }

  function onManualPlaceChange() {
    setIsOptimized(false);
    setIsSaved(false);
  }

  return (
    <Container>
      <Row>
        <TripName />
      </Row>
      <Row>
        <Col>
          <Row className={styles.routeListContainer}>
            <Route
              places={attractions}
              setPlaces={setAttractions}
              onManualPlaceChange={onManualPlaceChange}
            />
          </Row>
          <Row>
            <OptimizeButton isOptimized={isOptimized} optimize={optimize} />
          </Row>
        </Col>
        <Col>
          <Row>
            <Map mode="directions" attractions={attractions} centerLocation={tripObject.centerLocation} />
          </Row>
          <Row>
            <SaveButton isSaved={isSaved} save={save} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default RouteView;
