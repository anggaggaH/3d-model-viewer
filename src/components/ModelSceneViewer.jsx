/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Stats, Html } from '@react-three/drei';
import { useControls } from 'leva';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Models from '../assets/models.json';
import ModelGlb from '../assets/mercedes-benz-190/Mercedes-Benz-190.glb';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

function Model({ url }) {
	// const { scene } = useGLTF(ModelGlb);
	const { scene } = useLoader(GLTFLoader, ModelGlb, (loader) => {
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderConfig({ type: 'js' });
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
		// dracoLoader.setDecoderPath('/draco/gltf/');
		// .\node_modules\three\examples\jsm\libs\draco\

		loader.setDRACOLoader(dracoLoader);
	});
	const [cache, setCache] = useState({});

	if (!cache[url]) {
		const annotations = [];

		scene.traverse((o) => {
            if (o.userData) {
                console.log(o);
				annotations.push(
					<Html key={o.uuid} position={[o.position.x, o.position.y, o.position.z]} distanceFactor={0.25}>
						<div className='annotation'>{o.userData.name}</div>
					</Html>
				);
			}
		});

		console.log('Caching JSX for url ' + url);
		setCache({
			...cache,
			// eslint-disable-next-line react/no-unknown-property
			[url]: <primitive object={scene}>{annotations}</primitive>,
		});
	}
	return cache[url];
}

export default function ModelSceneViewer() {
	const { model } = useControls({
		model: {
			value: 'hammer',
			options: Object.keys(Models),
		},
	});

	return (
		<div className='container'>
			<Canvas camera={{ position: [0, 2, 3], near: 0.025 }}>
				<Environment
					files='https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@annotations/public/img/workshop_1k.hdr'
					background
				/>
				<group>
					<Model url={Models[model]} />
				</group>
				<OrbitControls />
				<Stats />
			</Canvas>
			<span id='info'>The {model.replace(/([A-Z])/g, ' $1').toLowerCase()} is selected.</span>
		</div>
	);
}
