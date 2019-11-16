import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//import { differenceWith, intersectionWith } from 'lodash';

//const merge = () => {
//
//};

//const diff = differenceWith(arrayOfChildren, lastChildren);

// get diff children?

const primary = children => children
  .map(child => child.key);

const childByKey = (children, key) => children
  .reduce(
    (child, e) => (child || (e.key === key) && e),
    null,
  );

//const priority = (children, lastChildren, silhouette, child) => {
//  console.log(child);
//  console.log(children.indexOf(child));
//  return 0;
//};

//Math.max(
//    children.indexOf(child),
//    Math.max(
//      silhouette.indexOf(child),
//      lastChildren.indexOf(child),
//    ),
//  );

export default ({ children, ...extraProps }) => {
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
        ...silhouette,
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
    },
    [children],
  );
  return (
    <>
      {merged}
    </>
  );
};

//// TODO: Need some way of managing the propagation of children.
//
//const primary = (children = []) => children
//  .map(child => child.key)
//  .filter(e => !!e)
//  .filter((e, i, arr) => (arr.indexOf(e) === i));
//
//const pipe = (keys, children) => children
//  .reduce(
//    (obj, child) => {
//      const key = child.key;
//      // XXX: Assumes the dollar prefix implies the user has specified their own key. (Is this even important?)
//      if (typeof key === 'string' && key.startsWith('.$')) {
//        return {
//          ...obj,
//          // TODO: Some wrapper.
//          [key]: child,
//        };
//      }
//      return obj;
//    },
//    {},
//  );
//
//const Silhouette = ({ children: input, ...extraProps }) => {
//  const children = React.Children.toArray(input);
//  const lastChildren = useState(
//    children,
//  );
//
//
//  const keys = primary(children);
//  const silhouette = useState(pipe(keys, children));
//  return (
//    <React.Fragment
//    >
//      {children.map(
//        child => (silhouette[child.key] || child),
//      )}
//    </React.Fragment>
//  );
//};
//
//export default Silhouette;
