import React from "react";
import TextValidator from './TextValidator';
import renderer from 'react-test-renderer';

describe("Snapshot test for the TextValidator component", () => {
  it("Matches DOM Snapshot", () => {
    const domTree = renderer.create(<TextValidator />).toJSON();
    expect(domTree).toMatchSnapshot();
  });
});
