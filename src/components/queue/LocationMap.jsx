import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import {Input, Button, Flex, Text} from '@chakra-ui/react'

const ReactGridLayout = WidthProvider(RGL);

export default class BasicLayout extends React.PureComponent {

  static defaultProps = {
    className: "layout",
    //items: 20,
    cols: 12,
    rowHeight: 20,
    onLayoutChange: function() {},
    verticalCompact: false,
    isResizeable: true,
    resizeHandles: ['se', 'nw', 'sw']
  };

  constructor(props) {
    super(props);
    this.items = props.items;
    this.name = props.name;
    //const layout = this.generateLayout();
    this.state = { 
      layout: _.map(new Array(this.props.items), function(item, i) {
        return {
          x: (i * 2) % 30,
          y: Math.floor(i / 6), 
          w: 2,
          h: 2,
          i: i.toString(),
          resizeHandles: ['se', 'nw', 'sw']
        };
    }),
    newCounter: this.items,
    createText: ''
    };
    this.onAddItem = this.onAddItem.bind(this);
  }

createElement(el) {
  const removeStyle = {
    position: "absolute",
    right: "2px",
    top: -4,
    cursor: "pointer"
  };
  const i = el.i;
  return (
    <div key={i} data-grid={el}>
      <span className="text">{i}</span>
      <span
        className="remove"
        style={removeStyle}
        onClick={this.onRemoveItem.bind(this, i)}
      >
        x
      </span>
    </div>
  );
}

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">Table {i}</span>
        </div>
      );
    });
  }

  onLayoutChange(layout) {
    console.log('called');
    this.props.onLayoutChange(layout);
    this.setState({layout: layout});
  }

  onAddItem() {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    this.setState({ layout: this.state.layout.concat({
        i: this.state.createText,
        x: (this.state.newCounter * 2) % 12,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      }),
      // Increment the counter to ensure key is always unique
    newCounter : this.state.newCounter + 1
    });
    console.log(this.state.layout);
  }

  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ layout: _.reject(this.state.layout, { i: i }) });
  }

  render() {
    return (
      <div>
      <Text marginTop={3}>Now Displaying: {this.name}</Text>
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange(this.state.layout)}
        {...this.props}
      >
        {_.map(this.state.layout, el => this.createElement(el))}
      </ReactGridLayout>
      <Flex w='50%' marginTop={3}>
        <Input
              width='50%'
              onChange={e => this.setState({createText: e.target.value})}
              value={this.state.createText}
            />
        <Button onClick={this.onAddItem} ml={3}>Add Item</Button>
      </Flex>
      </div>
    );
  }
}