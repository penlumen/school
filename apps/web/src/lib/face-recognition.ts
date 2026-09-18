import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = '/models';
let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

/** Loads the three models once (tiny detector, 68-point landmarks, recognition net). */
export async function loadFaceModels(): Promise<void> {
    if (modelsLoaded) return;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        modelsLoaded = true;
    })();

    return loadingPromise;
}

/**
 * Detects a single face in the given image/video element and returns its
 * 128-value descriptor, or null if no face was found.
 */
export async function getFaceDescriptor(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<number[] | null> {
    await loadFaceModels();

    const detection = await faceapi
        .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) return null;
    return Array.from(detection.descriptor);
}

export interface EnrolledFace {
    uuid: string;
    name: string;
    avatar?: string | null;
    face_descriptor: number[];
}

export interface MatchResult {
    uuid: string;
    name: string;
    avatar?: string | null;
    distance: number;
}

/** Euclidean-distance threshold below which two descriptors are considered the same person. */
const MATCH_THRESHOLD = 0.5;

/**
 * Compares a live descriptor against a list of enrolled people and returns
 * the closest match, if any, under the similarity threshold.
 */
export function matchFaceDescriptor(
    liveDescriptor: number[],
    enrolled: EnrolledFace[]
): MatchResult | null {
    if (enrolled.length === 0) return null;

    const labeled = enrolled.map(
        (person) =>
            new faceapi.LabeledFaceDescriptors(person.uuid, [
                Float32Array.from(person.face_descriptor),
            ])
    );

    const matcher = new faceapi.FaceMatcher(labeled, MATCH_THRESHOLD);
    const best = matcher.findBestMatch(Float32Array.from(liveDescriptor));

    if (best.label === 'unknown') return null;

    const person = enrolled.find((p) => p.uuid === best.label);
    if (!person) return null;

    return {uuid: person.uuid, name: person.name, avatar: person.avatar, distance: best.distance};
}
