import * as React from 'react'
import * as BABYLON from 'babylonjs'

export type SceneEventArgs = {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement;
};

export type SceneProps = {
  engineOptions?: BABYLON.EngineOptions;
  adaptToDeviceRatio?: boolean;
  onSceneMount?: (args: SceneEventArgs) => void;
  style?: object;
};

export default class Scene extends React.Component<SceneProps> {
  private engine: BABYLON.Engine
  private canvas: HTMLCanvasElement

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize()
    }
  }

  componentDidMount() {
    this.engine = new BABYLON.Engine(
        this.canvas,
        true,
        // this.props.engineOptions,
        // this.props.adaptToDeviceRatio
    )

    let scene = new BABYLON.Scene(this.engine)

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene,
        engine: this.engine,
        canvas: this.canvas
      })
    } else {
      console.error('onSceneMount function not available')
    }

    window.addEventListener('resize', this.onResizeWindow)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow)
  }

  onCanvasLoaded = (c: HTMLCanvasElement) => {
    if (c !== null) {
      this.canvas = c
    }
  }

  render() {
    const {style: propStyle} = this.props
    return (
        <canvas
            style={propStyle}
            ref={this.onCanvasLoaded}
        />
    )
  }
}
