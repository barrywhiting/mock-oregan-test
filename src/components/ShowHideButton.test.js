import React from "react";
import ShowHideButton from './ShowHideButton';
import renderer from 'react-test-renderer';

describe("Snapshot test for the ShowHideButton component", () => {
  it("Matches DOM Snapshot", () => {
    const domTree = renderer.create(<ShowHideButton />).toJSON();
    expect(domTree).toMatchSnapshot();
  });
});
