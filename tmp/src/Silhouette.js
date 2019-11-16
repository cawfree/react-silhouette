import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const primary = children => children
  .map(child => child.key);

const childByKey = (children, key) => children
  .reduce(
    (child, e) => (child || (e.key === key) && e),
    null,
  );

const Silhouette = ({ children, Memory, ...extraProps }) => {
  const arrayOfChildren = React.Children.toArray(children);
  const [ lastChildren, setLastChildren ] = useState(arrayOfChildren);
  const [ silhouette, setSilhouette ] = useState([]);
  const [ merged, setMerged ] = useState(arrayOfChildren);
  const [ weighting, setWeighting ] = useState(
    arrayOfChildren
      .reduce(
        (obj, child, i) => (
          {
            ...obj,
            [child.key]: i,
          }
        ),
        {},
      ),
  );
  // XXX: find position in the original array, then offset?
  useEffect(
    () => {
      const nextKeys = primary(arrayOfChildren);
      const lastKeys = primary(lastChildren);
      const added = nextKeys
        .filter(e => lastKeys.indexOf(e) < 0);
      const removed = lastKeys
        .filter(e => nextKeys.indexOf(e) < 0);
      setLastChildren(arrayOfChildren);
      const nextSilhouette = [
        ...silhouette
          .filter(child => nextKeys.indexOf(child.key) < 0),
        ...removed
          .map(key => childByKey(lastChildren, key)),
      ];
      const nextWeighting = added
        .reduce(
          (obj, child) => (
            {
              [child.key]: arrayOfChildren.indexOf(child)
            }
          ),
          weighting,
        );
      setMerged(
        [
          ...arrayOfChildren,
          ...nextSilhouette,
        ]
          .sort(
            (e0, e1) => (
              weighting[e0.key]- weighting[e1.key]
            ),
          ),
      );
      setSilhouette(
        nextSilhouette,
      );
    },
    [children],
  );
  return (
    <>
      {merged.map(
        child => (
          <Memory
            key={child.key}
            children={child}
            forget={!!childByKey(silhouette, child.key) && (() => {
              setSilhouette(silhouette.filter(e => (e.key !== child.key)));
              setMerged(merged.filter(e => (e.key !== child.key)));
              setWeighting(
                Object.entries(weighting)
                  .reduce(
                    (obj, [key, value]) => {
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
              );
            })}
          />
        ),
      )}
    </>
  );
};

Silhouette.propTypes = {
  Memory: PropTypes.elementType,
};

Silhouette.defaultProps = {
  Memory: ({ children, forget, ...extraProps }) => {
    (typeof forget === 'function') && forget();
    return (
      <React.Fragment
        children={children}
      />
    );
  },
};

export default Silhouette;
