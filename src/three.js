import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import LocomotiveScroll from "locomotive-scroll";
import gsap from 'gsap';

const locomotiveScroll = new LocomotiveScroll();

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isDesktop = window.innerWidth >= 1024;


if(!isMobile || isDesktop){
    const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

const cameraDistance = 20;

/* 
 To convert the original dimensions of three geometery into pixel

Explanation: 
- window.innerHeight / 2  -> (total window height's half);
- cameraDistance -> (z position of camera);
- Math.atan((window.innerHeight / 2) / cameraDistance)   -> tan of height and distance to get the angle;
- 2* Math.atan((window.innerHeight / 2) / cameraDistance)  -> double of angle found to get the full access in radian;
- angel * (180/Math.PI)  -> used to convert an angle from radians to degrees. Three.js uses degrees to create graphics

*/

const fov =
  2 * Math.atan((window.innerHeight / 2) / cameraDistance) * (180 / Math.PI);

const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = cameraDistance;

const planeGroup = [];
const images = document.querySelectorAll("img");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

images.forEach((image) => {
  const imgBounds = image.getBoundingClientRect();
  const texture = new THREE.TextureLoader().load(image.src);
  const geometry = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0}
    },
  });
  const plane = new THREE.Mesh(geometry, material);

  planeGroup.push(plane);
  scene.add(plane);
});

function updatePlanesPosition(scroll) {
  planeGroup.forEach((plane, i) => {
    const imgBounds = images[i].getBoundingClientRect();

    // trying to place a 3D plane in a Three.js scene
    plane.position.set(
      imgBounds.left - window.innerWidth / 2 + imgBounds.width / 2,
      -imgBounds.top + window.innerHeight / 2 - imgBounds.height / 2,
      0
    );
  });
}

function animate() {
  requestAnimationFrame(animate);
  // plane.rotation.y += 0.01;
  updatePlanesPosition();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const newFov = 2 * Math.atan((window.innerHeight / 2) / cameraDistance) * (180 / Math.PI);
  camera.fov = newFov;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePlanesPosition();
});

// locomotiveScroll.on("scroll", (obj) => {
//   updatePlanesPosition(obj.scroll);
// });

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; 

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planeGroup);

    planeGroup.forEach((plane) => {
        gsap.to(plane.material.uniforms.uHover, {value : 0, duration: 0.3})
    })

    if(intersects.length > 0){
        const intersectedPlane = intersects[0];
        const uv = intersectedPlane.uv;
        gsap.to(intersectedPlane.object.material.uniforms.uMouse.value, {x : uv.x, y: uv.y, duration: 0.5})
        gsap.to(intersectedPlane.object.material.uniforms.uHover, {value : 1, duration: 0.3})
        
        
        
    }
});

} else{
    document.querySelector('canvas').style.display = "none";
    document.querySelectorAll('img').forEach(image => {
        image.style.opacity = 1;
    })
}