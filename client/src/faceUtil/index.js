import * as faceapi from 'face-api.js';

export async function loadModels(
  setLoadingMessage,
  setLoadingMessageError
) {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';

  try {
    setLoadingMessage('Loading Face Detector');
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);

    setLoadingMessage('Loading 68 Facial Landmark Detector');
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);

    setLoadingMessage('Loading Feature Extractor');
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  } catch (err) {
    setLoadingMessageError(
      'Model loading failed. Please contact me about the bug:attendlytical@gmail.com'
    );
  }
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.8;
  const OPTION = new faceapi.SsdMobilenetv1Options({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  return fullDesc;
}

export async function createMatcher(faceProfile, maxDescriptorDistance) {
  if (!faceProfile) {
    throw new Error('faceProfile is undefined');
  }

  // Create labeled descriptors of member from profile
  let labeledDescriptors = faceProfile.map(
    (profile) =>
      new faceapi.LabeledFaceDescriptors(
        profile.student._id,
        profile.facePhotos.map(
          (photo) => new Float32Array(photo.faceDescriptor.match(/-?\d+(?:\.\d+)?/g).map(Number))
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );

  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.ssdMobilenetv1.params;
}

export function isFeatureExtractionModelLoaded() {
  return !!faceapi.nets.faceRecognitionNet.params;
}

export function isFacialLandmarkDetectionModelLoaded() {
  return !!faceapi.nets.faceLandmark68TinyNet.params;
}

// New function to extract and store face descriptors
export async function extractAndStoreFaceDescriptor(imagePath, storeDescriptorCallback) {
  // Load models
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

  // Extract face descriptors
  const img = await faceapi.fetchImage(imagePath);
  const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  const faceDescriptor = fullFaceDescription.descriptor;

  // Store faceDescriptor using the provided callback
  storeDescriptorCallback(faceDescriptor);
}