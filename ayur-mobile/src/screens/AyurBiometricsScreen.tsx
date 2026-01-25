/**
 * AyurBiometrics Camera Screen
 *
 * Vision-based Dosha diagnosis using camera.
 * The "WOW" feature that sets this app apart.
 *
 * Features:
 * - Camera with guideline overlays
 * - Scanning animation
 * - AI-powered analysis (mock)
 * - Auto-fill quiz results
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDoshaMorphingTheme } from '../hooks/useDoshaMorphingTheme';
import { useDoshaStore } from '../store/doshaStore';
import { analyzeBiometrics, biometricsToQuizResult, BiometricAnalysis } from '../services/ayurBiometricsService';
import { useNavigation } from '@react-navigation/native';

type ScanType = 'tongue' | 'face';

/**
 * AyurBiometrics Camera Screen
 */
export const AyurBiometricsScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useDoshaMorphingTheme();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanType, setScanType] = useState<ScanType>('tongue');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<BiometricAnalysis | null>(null);

  const cameraRef = useRef<Camera>(null);
  const { saveResults } = useDoshaStore();

  // Scanning animation
  const scanY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isScanning) {
      // Start scanning animation
      scanY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [isScanning]);

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scanY.value * 300, // Height of scan area
        },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsScanning(true);

      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      // Analyze with AI service (mock)
      const result = await analyzeBiometrics(photo.uri, scanType);
      setAnalysis(result);

      // Convert to quiz result format and save
      const quizResult = biometricsToQuizResult(result);
      const fullResult = {
        ...quizResult,
        description: `Based on ${scanType} analysis, your dominant dosha is ${result.dominantDosha}.`,
        recommendations: {
          diet: result.recommendations,
          lifestyle: [],
          exercise: [],
          products: [],
        },
        completedAt: new Date().toISOString(),
      };

      saveResults(fullResult);

      setIsScanning(false);

      // Show success
      Alert.alert(
        'Analysis Complete!',
        `Your dominant dosha is ${result.dominantDosha}. Confidence: ${result.confidence.toFixed(0)}%`,
        [
          {
            text: 'View Results',
            onPress: () => {
              // Navigate to results screen or close
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.message, { color: theme.colors.text, marginTop: theme.spacing.md }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="camera-off" size={64} color={theme.colors.textSecondary} />
        <Text style={[styles.message, { color: theme.colors.text, marginTop: theme.spacing.md }]}>
          Camera permission denied
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.button,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              marginTop: theme.spacing.lg,
            }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.front}
      >
        {/* Header */}
        <BlurView
          intensity={theme.visual.glassBlur}
          tint="dark"
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AyurBiometrics Scan</Text>
          <View style={{ width: 28 }} />
        </BlurView>

        {/* Scan Type Selector */}
        <View style={styles.scanTypeContainer}>
          <BlurView
            intensity={20}
            tint="dark"
            style={[
              styles.scanTypeSelector,
              {
                borderRadius: theme.borderRadius.button,
                overflow: 'hidden',
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.scanTypeButton,
                scanType === 'tongue' && styles.scanTypeButtonActive,
                {
                  borderRadius: theme.borderRadius.button,
                }
              ]}
              onPress={() => setScanType('tongue')}
              disabled={isScanning}
            >
              <Text style={[
                styles.scanTypeText,
                scanType === 'tongue' && styles.scanTypeTextActive,
              ]}>
                👅 Tongue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scanTypeButton,
                scanType === 'face' && styles.scanTypeButtonActive,
                {
                  borderRadius: theme.borderRadius.button,
                }
              ]}
              onPress={() => setScanType('face')}
              disabled={isScanning}
            >
              <Text style={[
                styles.scanTypeText,
                scanType === 'face' && styles.scanTypeTextActive,
              ]}>
                😊 Face
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Guideline Overlay */}
        <View style={styles.guidelineContainer}>
          {/* Outer glow */}
          <Animated.View style={[styles.guidelineGlow, glowStyle]}>
            <LinearGradient
              colors={['rgba(46, 125, 50, 0)', 'rgba(46, 125, 50, 0.3)', 'rgba(46, 125, 50, 0)']}
              style={styles.gradientGlow}
            />
          </Animated.View>

          {/* Guideline shape */}
          <View style={[
            styles.guideline,
            scanType === 'tongue' ? styles.guidelineTongue : styles.guidelineFace,
          ]}>
            {/* Corner markers */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            {/* Scanning laser line */}
            {isScanning && (
              <Animated.View style={[styles.scanLine, scanLineStyle]}>
                <LinearGradient
                  colors={['transparent', theme.colors.primary, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scanLineGradient}
                />
              </Animated.View>
            )}
          </View>

          {/* Instructions */}
          <BlurView
            intensity={20}
            tint="dark"
            style={[
              styles.instructions,
              {
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
              }
            ]}
          >
            <Text style={styles.instructionText}>
              {scanType === 'tongue'
                ? '👅 Stick out your tongue and align it within the frame'
                : '😊 Position your face within the oval frame'}
            </Text>
          </BlurView>
        </View>

        {/* Capture Button */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isScanning && styles.captureButtonDisabled,
            ]}
            onPress={handleCapture}
            disabled={isScanning}
            activeOpacity={0.8}
          >
            {isScanning ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          {!isScanning && (
            <Text style={styles.captureText}>
              Tap to scan
            </Text>
          )}
          {isScanning && (
            <Animated.Text
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.scanningText}
            >
              Analyzing...
            </Text>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {},
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  scanTypeContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 80,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  scanTypeSelector: {
    flexDirection: 'row',
    padding: 4,
  },
  scanTypeButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 2,
  },
  scanTypeButtonActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
  },
  scanTypeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  scanTypeTextActive: {
    color: '#FFF',
  },
  guidelineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  guidelineGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
  },
  gradientGlow: {
    flex: 1,
    borderRadius: 160,
  },
  guideline: {
    position: 'relative',
    borderWidth: 3,
    borderColor: 'rgba(46, 125, 50, 0.8)',
  },
  guidelineTongue: {
    width: 200,
    height: 300,
    borderRadius: 100,
  },
  guidelineFace: {
    width: 280,
    height: 320,
    borderRadius: 140,
  },
  cornerTL: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#2E7D32',
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#2E7D32',
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#2E7D32',
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#2E7D32',
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
  },
  scanLineGradient: {
    flex: 1,
  },
  instructions: {
    marginTop: 32,
    maxWidth: 280,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  captureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  scanningText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
});
