import * as React from "react";
import * as BABYLON from "babylonjs";
import BabylonScene from "./BabylonScene";
import PANO from "./pano.png";

class Hall3D extends React.Component {
  render() {
    return (
      <BabylonScene
        style={{ width: "100vw", height: "100vh" }}
        onSceneMount={({ engine, scene, canvas }) => {
          _showWorldAxis(scene, 1);
          const camera = new BABYLON.ArcRotateCamera(
            "Camera",
            -Math.PI / 4,
            Math.PI / 2,
            5,
            BABYLON.Vector3.Zero(),
            scene
          );
          camera.attachControl(canvas, true);
          camera.inputs.attached.mousewheel.detachControl(canvas);

          const dome = new BABYLON.PhotoDome(
            "hall",
            PANO,
            {
              resolution: 32,
              size: 1000
            },
            scene
          );

          const IPO = BABYLON.MeshBuilder.CreateGround(
            "IPO",
            { width: 86, height: 41 },
            scene
          );
          const IPOMat = new BABYLON.StandardMaterial("ground", scene);
          const texture = new BABYLON.DynamicTexture('text', {width:90, height: 40}, scene, false);
          // IPOMat.emissiveColor = BABYLON.Color3.Blue();
          // IPOMat.alpha = 0;
          IPOMat.emissiveTexture = texture;
          IPO.material = IPOMat;
          texture.drawText('IPO', 20, 30, 'bold 30px monospace', 'black', 'white', true, true);
          const IPOPos = new BABYLON.Vector3(-300, 107, 302)
          IPO.position = IPOPos;
          IPO.rotation.x -= Math.PI / 2;
          IPO.rotation.y -= Math.PI / 4;

          IPO.actionManager = new BABYLON.ActionManager(scene);
          IPO.actionManager.registerAction(
            new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnPickTrigger,
                IPO.material,
                'emissiveColor',
                BABYLON.Color3.Blue(),
                1000,
                null,
                false,
                () => {
                  console.log('clicked')
                  window.location.href = 'http://baidu.com'
                }
            )
        );

          engine.runRenderLoop(() => {
            if (scene) {
              scene.render();
            }
          });
        }}
      />
    );
  }
}

export default Hall3D;

function _showWorldAxis(scene, size) {
  var makeTextPlane = function(text, color, size) {
      var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
      var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
      const planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      planeMaterial.backFaceCulling = false;
      planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      planeMaterial.diffuseTexture = dynamicTexture;
      plane.material = planeMaterial;
  return plane;
   };
  var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
  axisX.color = new BABYLON.Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = BABYLON.Mesh.CreateLines("axisY", [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
      new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};
