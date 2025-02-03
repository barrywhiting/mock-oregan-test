import Button from './Button';
import React from "react";
import renderer from 'react-test-renderer';

describe("Snapshot test for the Button component", () => {
  it("Matches DOM Snapshot", () => {
    const domTree = renderer.create(<Button />).toJSON();
    expect(domTree).toMatchSnapshot();
  });
});
