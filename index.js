/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const primary = children => children
  .map(child => child.key);

const childByKey = (children, key) => children
  .reduce(
    (child, e) => (child || ((e.key === key) && e)),
    null,
  );

const Silhouette = ({ children, Frame, ...extraProps }) => {
  const arrayOfChildren = React.Children.toArray(children);
  const [ state, setState ] = useState(
    {
      lastChildren: arrayOfChildren,
      silhouette: [],
      merged: arrayOfChildren,
      weighting: arrayOfChildren
        .reduce(
          (obj, child, i) => (
            {
              ...obj,
              [child.key]: i,
            }
          ),
          {},
        ),
    },
  );
  const { lastChildren, silhouette, merged, weighting } = state;
  useEffect(
    () => {
      const nextKeys = primary(arrayOfChildren);
      const lastKeys = primary(lastChildren);
      const added = nextKeys
        .filter(e => lastKeys.indexOf(e) < 0);
      const removed = lastKeys
        .filter(e => nextKeys.indexOf(e) < 0);
      const nextSilhouette = [
        ...silhouette
          .filter(child => nextKeys.indexOf(child.key) < 0),
        ...removed
          .map(key => childByKey(lastChildren, key)),
      ];
      setState(
        {
          ...state,
          lastChildren: arrayOfChildren,
          nextWeighting: added
            .reduce(
              (obj, child) => (
                {
                  ...obj,
                  [child.key]: arrayOfChildren.indexOf(child)
                }
              ),
              weighting,
            ),
          merged: [
            ...arrayOfChildren,
            ...nextSilhouette,
          ]
            .sort(
              (e0, e1) => (
                weighting[e0.key]- weighting[e1.key]
              ),
            ),
          silhouette: nextSilhouette,
        },
      );
    },
    [children],
  );
  return (
    <>
      {merged.map(
        child => (
          <Frame
            key={child.key}
            children={child}
            unmount={!!childByKey(silhouette, child.key) && (() => {
              setState(
                {
                  ...state,
                  silhouette: silhouette.filter(e => (e.key !== child.key)),
                  merged: merged.filter(e => (e.key !== child.key)),
                  weighting: Object.entries(weighting)
                    .reduce(
                      (obj, [ key, value ]) => {
                        if (key !== child.key) {
                          return {
                            ...obj,
                            [key]: value,
                          };
                        }
                        return obj;
                      },
                      {},
                    ),
                },
              );
            })}
          />
        ),
      )}
    </>
  );
};

Silhouette.propTypes = {
  Frame: PropTypes.elementType,
};

Silhouette.defaultProps = {
  Frame: ({ children, unmount, ...extraProps }) => {
    (typeof unmount === 'function') && unmount();
    return (
      <React.Fragment
        children={children}
      />
    );
  },
};

export default Silhouette;
