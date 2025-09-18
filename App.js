// App.js
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Enhanced Color Scheme
const colors = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  secondary: '#5AC8FA',
  accent: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  purple: '#AF52DE',
  
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceLight: '#F9F9FB',
  
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#C7C7CC',
  
  border: '#C6C6C8',
  divider: '#E5E5EA',
  
  gradientStart: '#007AFF',
  gradientEnd: '#5AC8FA',
  
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  modalOverlay: 'rgba(0, 0, 0, 0.4)',
};

// Main App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userRole, setUserRole] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentScreen]);

  const navigateTo = (screen, role = '') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentScreen(screen);
    if (role) setUserRole(role);
  };

  const renderScreen = () => {
    const screens = {
      login: <LoginScreen onLogin={(role) => navigateTo('dashboard', role)} />,
      dashboard: <DashboardScreen role={userRole} navigateTo={navigateTo} />,
      audit: <AuditScreen navigateTo={navigateTo} />,
      guide: <GuideScreen navigateTo={navigateTo} />,
      bda: <BDAScreen navigateTo={navigateTo} />,
      mapping: <MappingScreen navigateTo={navigateTo} />,
      webHome: <WebHomeScreen role={userRole} navigateTo={navigateTo} />,
    };
    
    return (
      <Animated.View 
        style={{ 
          flex: 1, 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {screens[currentScreen] || screens.login}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {renderScreen()}
    </SafeAreaView>
  );
};

// Enhanced Login Screen
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setLoading(false);
      onLogin('expert');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.loginContainer}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.loginGradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View 
        style={[
          styles.loginContent,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.logo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoText}>AR</Text>
          </LinearGradient>
          <Text style={styles.appTitle}>Industrial AR System</Text>
          <Text style={styles.appSubtitle}>Next-Gen Equipment Management</Text>
        </View>
        
        <View style={styles.loginCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Username"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity style={styles.ssoButton} activeOpacity={0.8}>
            <Text style={styles.ssoIcon}>🔐</Text>
            <Text style={styles.ssoButtonText}>Continue with SSO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// Enhanced Dashboard Screen
const DashboardScreen = ({ role, navigateTo }) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const animatedValues = useRef([]).current;
  
  // Initialize animated values for cards
  for (let i = 0; i < 6; i++) {
    if (!animatedValues[i]) {
      animatedValues[i] = new Animated.Value(0);
    }
  }

  useEffect(() => {
    const animations = animatedValues.map((anim, index) => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  }, []);
  
  const dashboardCards = [
    { 
      id: '1', 
      title: 'Mapped Procedures', 
      count: 24, 
      icon: '📍', 
      gradient: [colors.primary, colors.secondary],
      trend: '+12%',
      subtitle: '3 pending reviews'
    },
    { 
      id: '2', 
      title: 'Active Audits', 
      count: 12, 
      icon: '📋', 
      gradient: [colors.purple, '#C77DFF'],
      trend: '+5%',
      subtitle: '2 due today'
    },
    { 
      id: '3', 
      title: 'Guides', 
      count: 18, 
      icon: '📚', 
      gradient: [colors.success, '#52D858'],
      trend: '+8%',
      subtitle: 'Recently updated'
    },
    { 
      id: '4', 
      title: 'BDAs', 
      count: 8, 
      icon: '🔧', 
      gradient: [colors.warning, '#FFB340'],
      trend: '-2%',
      subtitle: '1 in progress'
    },
    { 
      id: '5', 
      title: 'Pins & Steps', 
      count: 156, 
      icon: '📌', 
      gradient: [colors.accent, '#FF6B6B'],
      trend: '+23%',
      subtitle: 'Across all sites'
    },
    { 
      id: '6', 
      title: 'Reports', 
      count: 5, 
      icon: '📊', 
      gradient: ['#00C9FF', '#92FE9D'],
      trend: 'New',
      subtitle: 'Generate monthly'
    },
  ];

  const createMenuItems = [
    { id: '1', title: 'Mapped Procedure', icon: '🗺️', screen: 'mapping', color: colors.primary },
    { id: '2', title: 'New Audit', icon: '✅', screen: 'audit', color: colors.purple },
    { id: '3', title: 'Create Guide', icon: '📖', screen: 'guide', color: colors.success },
    { id: '4', title: 'Breakdown Analysis', icon: '🔍', screen: 'bda', color: colors.warning },
  ];

  const recentActivities = [
    { id: '1', title: 'Equipment A-234 Inspection', time: '2 hours ago', type: 'audit', status: 'completed' },
    { id: '2', title: 'New procedure mapped - Line 5', time: '4 hours ago', type: 'procedure', status: 'new' },
    { id: '3', title: 'Maintenance guide updated', time: '6 hours ago', type: 'guide', status: 'updated' },
    { id: '4', title: 'BDA Report generated', time: '1 day ago', type: 'bda', status: 'completed' },
    { id: '5', title: 'Safety audit scheduled', time: '2 days ago', type: 'audit', status: 'pending' },
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      completed: colors.success,
      new: colors.primary,
      updated: colors.secondary,
      pending: colors.warning,
    };
    return statusColors[status] || colors.textSecondary;
  };

  return (
    <View style={styles.dashboardContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.dashboardHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Welcome back!</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={() => {
              setShowCreateMenu(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.cardsGrid}>
          {dashboardCards.map((card, index) => (
            <Animated.View
              key={card.id}
              style={[
                styles.dashboardCardContainer,
                {
                  opacity: animatedValues[index],
                  transform: [
                    {
                      translateY: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity 
                style={styles.modernDashboardCard}
                activeOpacity={0.9}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <LinearGradient
                  colors={card.gradient}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardIcon}>{card.icon}</Text>
                    <View style={styles.trendBadge}>
                      <Text style={styles.trendText}>{card.trend}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardCount}>{card.count}</Text>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.map((activity) => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              activeOpacity={0.7}
            >
              <View style={styles.activityIndicator}>
                <View style={[styles.activityDot, { backgroundColor: getStatusColor(activity.status) }]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(activity.status) }]}>
                      {activity.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.activityArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.webPortalCard}
          onPress={() => navigateTo('webHome')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.webPortalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.webPortalContent}>
              <Text style={styles.webPortalIcon}>🌐</Text>
              <View style={styles.webPortalTextContainer}>
                <Text style={styles.webPortalTitle}>Web Portal</Text>
                <Text style={styles.webPortalSubtitle}>Access advanced features</Text>
              </View>
              <Text style={styles.webPortalArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCreateMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowCreateMenu(false)}
        >
          <View style={styles.createMenuModern}>
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>Create New</Text>
            <View style={styles.createMenuGrid}>
              {createMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.createMenuCard}
                  onPress={() => {
                    setShowCreateMenu(false);
                    navigateTo(item.screen);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.createMenuCardText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Enhanced Audit Screen
const AuditScreen = ({ navigateTo }) => {
  const [mode, setMode] = useState('create');
  const [step, setStep] = useState('form');
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { id: '1', name: 'Safety Inspection', icon: '🛡️' },
    { id: '2', name: 'Quality Check', icon: '✅' },
    { id: '3', name: 'Maintenance Review', icon: '🔧' },
    { id: '4', name: 'Compliance Audit', icon: '📋' },
  ];

  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.modernHeader}
      >
        <TouchableOpacity 
          onPress={() => navigateTo('dashboard')}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleModern}>Audit Management</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {step === 'form' && (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Audit Details</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Audit Name</Text>
              <TextInput
                style={styles.modernFormInput}
                placeholder="Enter audit name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modernFormInput, styles.textArea]}
                placeholder="Describe the audit purpose and scope"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <Text style={styles.inputLabel}>Select Template</Text>
            <View style={styles.templateGrid}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplate === template.id && styles.templateCardSelected
                  ]}
                  onPress={() => setSelectedTemplate(template.id)}
                >
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <Text style={styles.templateName}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => setStep('capture')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.buttonGradient}
              >
                <Text style={styles.nextButtonText}>Next Step</Text>
                <Text style={styles.nextButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {step === 'capture' && (
        <View style={styles.captureContainer}>
          <View style={styles.modernCameraView}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)']}
              style={styles.cameraOverlay}
            >
              <View style={styles.cameraFrame}>
                <View style={styles.cameraCorner} />
                <View style={[styles.cameraCorner, styles.topRight]} />
                <View style={[styles.cameraCorner, styles.bottomLeft]} />
                <View style={[styles.cameraCorner, styles.bottomRight]} />
              </View>
              <Text style={styles.cameraInstruction}>Position equipment in frame</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.captureControlsModern}>
            <TouchableOpacity style={styles.galleryButton}>
              <Text style={styles.controlIcon}>🖼️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButtonModern}>
              <View style={styles.captureButtonInner}>
                <View style={styles.captureButtonCore} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.imageCounter}>
              <Text style={styles.imageCountText}>{capturedImages.length}</Text>
              <Text style={styles.imageCountLabel}>/ 20</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.processButton}
            onPress={() => setStep('review')}
          >
            <LinearGradient
              colors={[colors.success, '#52D858']}
              style={styles.buttonGradient}
            >
              <Text style={styles.processButtonText}>Process with AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {step === 'review' && (
        <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.aiResultsCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiIcon}>🤖</Text>
              <Text style={styles.aiTitle}>AI Analysis Complete</Text>
            </View>
            
            <View style={styles.findingsContainer}>
              <View style={styles.findingCard}>
                <View style={styles.findingHeader}>
                  <View style={[styles.severityIndicator, { backgroundColor: colors.warning }]} />
                  <Text style={styles.findingTitle}>Minor Wear Detected</Text>
                  <TouchableOpacity>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.findingDescription}>
                  Surface wear observed on component A-234. Recommend inspection within 30 days.
                </Text>
                <View style={styles.findingActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Add Note</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Flag for Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.findingCard}>
                <View style={styles.findingHeader}>
                  <View style={[styles.severityIndicator, { backgroundColor: colors.success }]} />
                  <Text style={styles.findingTitle}>Optimal Performance</Text>
                  <TouchableOpacity>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.findingDescription}>
                  All systems operating within normal parameters. No immediate action required.
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.completeButton}>
              <LinearGradient
                colors={[colors.success, '#52D858']}
                style={styles.buttonGradient}
              >
                <Text style={styles.completeButtonText}>Complete Audit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

// Enhanced Guide Screen
const GuideScreen = ({ navigateTo }) => {
  const [mode, setMode] = useState('create');
  const [step, setStep] = useState('form');
  const [selectedType, setSelectedType] = useState('');

  const guideTypes = [
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', color: colors.primary },
    { id: 'operational', label: 'Operational', icon: '⚙️', color: colors.secondary },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔍', color: colors.warning },
    { id: 'safety', label: 'Safety', icon: '🛡️', color: colors.success },
  ];

  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[colors.success, '#52D858']}
        style={styles.modernHeader}
      >
        <TouchableOpacity 
          onPress={() => navigateTo('dashboard')}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleModern}>Guide Creator</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {step === 'form' && (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Guide Information</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Guide Title</Text>
              <TextInput
                style={styles.modernFormInput}
                placeholder="Enter guide title"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modernFormInput, styles.textArea]}
                placeholder="Describe the guide content"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <Text style={styles.inputLabel}>Guide Type</Text>
            <View style={styles.typeSelector}>
              {guideTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOption,
                    selectedType === type.id && styles.typeOptionSelected,
                    { borderColor: selectedType === type.id ? type.color : colors.border }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.id && { color: type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => setStep('capture')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.success, '#52D858']}
                style={styles.buttonGradient}
              >
                <Text style={styles.nextButtonText}>Capture Steps</Text>
                <Text style={styles.nextButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {step === 'capture' && (
        <View style={styles.guideStepsContainer}>
          <ScrollView style={styles.stepsScrollView}>
            {[1, 2, 3, 4].map((stepNum) => (
              <View key={stepNum} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{stepNum}</Text>
                  </View>
                  <Text style={styles.stepTitle}>Step {stepNum}</Text>
                  <TouchableOpacity style={styles.stepMenu}>
                    <Text style={styles.menuDots}>⋮</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.stepImageArea}>
                  <LinearGradient
                    colors={['#f0f0f0', '#e0e0e0']}
                    style={styles.imagePlaceholder}
                  >
                    <Text style={styles.addImageIcon}>📸</Text>
                    <Text style={styles.addImageText}>Add Image</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TextInput
                  style={styles.stepInput}
                  placeholder="Describe this step..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                />
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.guideFooter}>
            <TouchableOpacity style={styles.addStepButton}>
              <Text style={styles.addStepIcon}>+</Text>
              <Text style={styles.addStepText}>Add Step</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.generateButton}>
              <LinearGradient
                colors={[colors.purple, '#C77DFF']}
                style={styles.buttonGradient}
              >
                <Text style={styles.generateButtonText}>Generate Guide</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Enhanced BDA Screen
const BDAScreen = ({ navigateTo }) => {
  const [mediaType, setMediaType] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[colors.warning, '#FFB340']}
        style={styles.modernHeader}
      >
        <TouchableOpacity 
          onPress={() => navigateTo('dashboard')}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleModern}>Breakdown Analysis</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>BDA Information</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Analysis Title</Text>
            <TextInput
              style={styles.modernFormInput}
              placeholder="Enter BDA title"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Equipment Details</Text>
            <TextInput
              style={[styles.modernFormInput, styles.textArea]}
              placeholder="Describe the equipment and issue"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <Text style={styles.inputLabel}>Media Source</Text>
          <View style={styles.mediaOptionsModern}>
            <TouchableOpacity 
              style={[styles.mediaCardModern, mediaType === 'record' && styles.mediaCardSelected]}
              onPress={() => setMediaType('record')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={mediaType === 'record' ? [colors.warning, '#FFB340'] : ['#f5f5f5', '#ffffff']}
                style={styles.mediaCardGradient}
              >
                <Text style={[styles.mediaCardIcon, mediaType === 'record' && styles.mediaCardIconSelected]}>
                  🎥
                </Text>
                <Text style={[styles.mediaCardTitle, mediaType === 'record' && styles.mediaCardTitleSelected]}>
                  Record Video
                </Text>
                <Text style={[styles.mediaCardDesc, mediaType === 'record' && styles.mediaCardDescSelected]}>
                  Capture live footage
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mediaCardModern, mediaType === 'upload' && styles.mediaCardSelected]}
              onPress={() => setMediaType('upload')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={mediaType === 'upload' ? [colors.warning, '#FFB340'] : ['#f5f5f5', '#ffffff']}
                style={styles.mediaCardGradient}
              >
                <Text style={[styles.mediaCardIcon, mediaType === 'upload' && styles.mediaCardIconSelected]}>
                  📁
                </Text>
                <Text style={[styles.mediaCardTitle, mediaType === 'upload' && styles.mediaCardTitleSelected]}>
                  Upload Video
                </Text>
                <Text style={[styles.mediaCardDesc, mediaType === 'upload' && styles.mediaCardDescSelected]}>
                  Use existing file
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {mediaType && (
            <>
              <View style={styles.videoPreviewModern}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)']}
                  style={styles.videoOverlay}
                >
                  <TouchableOpacity style={styles.playButtonModern}>
                    <Text style={styles.playIcon}>▶️</Text>
                  </TouchableOpacity>
                  <Text style={styles.videoDuration}>02:34</Text>
                </LinearGradient>
              </View>
              
              <TouchableOpacity 
                style={styles.analyzeButton}
                onPress={() => setAnalysisComplete(true)}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
          
          {analysisComplete && (
            <View style={styles.analysisResults}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultIcon}>🤖</Text>
                <Text style={styles.resultTitle}>Analysis Complete</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Root Cause</Text>
                <Text style={styles.resultValue}>Bearing failure due to inadequate lubrication</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Severity</Text>
                <View style={styles.severityBadge}>
                  <Text style={styles.severityText}>High Priority</Text>
                </View>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Recommended Actions</Text>
                <View style={styles.actionsList}>
                  <View style={styles.actionItem}>
                    <Text style={styles.actionNumber}>1</Text>
                    <Text style={styles.actionText}>Replace bearing assembly</Text>
                  </View>
                  <View style={styles.actionItem}>
                    <Text style={styles.actionNumber}>2</Text>
                    <Text style={styles.actionText}>Review lubrication schedule</Text>
                  </View>
                  <View style={styles.actionItem}>
                    <Text style={styles.actionNumber}>3</Text>
                    <Text style={styles.actionText}>Implement predictive maintenance</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.saveAnalysisButton}>
                <LinearGradient
                  colors={[colors.success, '#52D858']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Analysis</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Enhanced Mapping Screen
const MappingScreen = ({ navigateTo }) => {
  const [step, setStep] = useState('scan');
  const [anchors, setAnchors] = useState([]);

  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[colors.secondary, colors.primary]}
        style={styles.modernHeader}
      >
        <TouchableOpacity 
          onPress={() => navigateTo('dashboard')}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitleModern}>AR Mapping</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {step === 'scan' && (
        <View style={styles.arContainer}>
          <View style={styles.arViewModern}>
            <LinearGradient
              colors={['rgba(0,122,255,0.1)', 'rgba(90,200,250,0.1)']}
              style={styles.arGradientOverlay}
            >
              <View style={styles.arGrid}>
                {[...Array(20)].map((_, i) => (
                  <View key={i} style={styles.arGridLine} />
                ))}
              </View>
              
              <View style={styles.arCrosshairModern}>
                <View style={styles.arCrosshairHorizontal} />
                <View style={styles.arCrosshairVertical} />
                <View style={styles.arCrosshairCenter} />
              </View>
              
              <View style={styles.arInfo}>
                <View style={styles.arInfoBadge}>
                  <Text style={styles.arInfoIcon}>📍</Text>
                  <Text style={styles.arInfoText}>GPS: Active</Text>
                </View>
                <View style={styles.arInfoBadge}>
                  <Text style={styles.arInfoIcon}>📐</Text>
                  <Text style={styles.arInfoText}>Area: 45m²</Text>
                </View>
              </View>
              
              <Text style={styles.arInstructionModern}>
                Move device to scan environment
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.arControlsModern}>
            <TouchableOpacity style={styles.arActionButton}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.arButtonGradient}
              >
                <Text style={styles.arButtonIcon}>🔄</Text>
                <Text style={styles.arButtonText}>Reset</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.arCaptureButton}
              onPress={() => setStep('form')}
            >
              <LinearGradient
                colors={[colors.success, '#52D858']}
                style={styles.arCaptureGradient}
              >
                <Text style={styles.arCaptureIcon}>📸</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.arActionButton}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.arButtonGradient}
              >
                <Text style={styles.arButtonIcon}>⚙️</Text>
                <Text style={styles.arButtonText}>Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'form' && (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Mapping Details</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Map Name</Text>
              <TextInput
                style={styles.modernFormInput}
                placeholder="Enter map name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            
            <View style={styles.gridInputs}>
              <View style={styles.gridInputItem}>
                <Text style={styles.inputLabel}>Site</Text>
                <TextInput
                  style={styles.modernFormInput}
                  placeholder="Site name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <View style={styles.gridInputItem}>
                <Text style={styles.inputLabel}>Section</Text>
                <TextInput
                  style={styles.modernFormInput}
                  placeholder="Section"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => setStep('anchors')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.buttonGradient}
              >
                <Text style={styles.nextButtonText}>Add Anchors</Text>
                <Text style={styles.nextButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {step === 'anchors' && (
        <View style={styles.anchorEditContainer}>
          <View style={styles.anchorMapView}>
            <LinearGradient
              colors={['#f0f5ff', '#e0ecff']}
              style={styles.anchorMapBackground}
            >
              {anchors.map((anchor, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.anchorPinModern, { top: anchor.y, left: anchor.x }]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.accent, '#FF6B6B']}
                    style={styles.anchorPinGradient}
                  >
                    <Text style={styles.anchorPinNumber}>{index + 1}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.addAnchorFloating}
                onPress={() => {
                  const newAnchor = {
                    x: Math.random() * (width - 100) + 20,
                    y: Math.random() * 200 + 50,
                  };
                  setAnchors([...anchors, newAnchor]);
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.addAnchorGradient}
                >
                  <Text style={styles.addAnchorPlus}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
          <View style={styles.anchorListModern}>
            <Text style={styles.anchorListTitle}>Anchor Points ({anchors.length})</Text>
            <ScrollView style={styles.anchorScrollList}>
              {anchors.map((_, index) => (
                <View key={index} style={styles.anchorListCard}>
                  <View style={styles.anchorListLeft}>
                    <View style={styles.anchorBadge}>
                      <Text style={styles.anchorBadgeText}>{index + 1}</Text>
                    </View>
                    <TextInput
                      style={styles.anchorNameField}
                      placeholder={`Anchor point ${index + 1}`}
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                  <TouchableOpacity style={styles.addStepsButton}>
                    <Text style={styles.addStepsIcon}>📝</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.saveMappingButton}>
              <LinearGradient
                colors={[colors.success, '#52D858']}
                style={styles.buttonGradient}
              >
                <Text style={styles.saveMappingText}>Save Mapping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Enhanced Web Home Screen
const WebHomeScreen = ({ role, navigateTo }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'management', label: 'Management', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
  ];

  return (
    <View style={styles.webContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.webHeaderModern}
      >
        <TouchableOpacity 
          onPress={() => navigateTo('dashboard')}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.webHeaderContent}>
          <Text style={styles.webHeaderTitle}>Web Portal</Text>
          <Text style={styles.webHeaderSubtitle}>
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Expert'} Access
          </Text>
        </View>
        <TouchableOpacity style={styles.webProfileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.webTabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.webTab, activeTab === tab.id && styles.webTabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.webTabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.webTabLabel,
              activeTab === tab.id && styles.webTabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.webContent} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.statCardGradient}
            >
              <Text style={styles.statCardValue}>156</Text>
              <Text style={styles.statCardLabel}>Total Users</Text>
              <View style={styles.statCardTrend}>
                <Text style={styles.trendIcon}>↑</Text>
                <Text style={styles.trendValue}>12%</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.success, '#52D858']}
              style={styles.statCardGradient}
            >
              <Text style={styles.statCardValue}>98%</Text>
              <Text style={styles.statCardLabel}>System Health</Text>
              <View style={styles.statCardTrend}>
                <Text style={styles.trendIcon}>→</Text>
                <Text style={styles.trendValue}>Stable</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.warning, '#FFB340']}
              style={styles.statCardGradient}
            >
              <Text style={styles.statCardValue}>24</Text>
              <Text style={styles.statCardLabel}>Active Tasks</Text>
              <View style={styles.statCardTrend}>
                <Text style={styles.trendIcon}>↓</Text>
                <Text style={styles.trendValue}>3%</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.purple, '#C77DFF']}
              style={styles.statCardGradient}
            >
              <Text style={styles.statCardValue}>5</Text>
              <Text style={styles.statCardLabel}>Sites</Text>
              <View style={styles.statCardTrend}>
                <Text style={styles.trendIcon}>+</Text>
                <Text style={styles.trendValue}>New</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Management Tools */}
        <View style={styles.managementSection}>
          <Text style={styles.sectionTitleModern}>Management Tools</Text>
          
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard}>
              <View style={styles.toolIconContainer}>
                <Text style={styles.toolIcon}>👥</Text>
              </View>
              <Text style={styles.toolTitle}>User Management</Text>
              <Text style={styles.toolDescription}>Manage users and roles</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolCard}>
              <View style={styles.toolIconContainer}>
                <Text style={styles.toolIcon}>🏭</Text>
              </View>
              <Text style={styles.toolTitle}>Asset Control</Text>
              <Text style={styles.toolDescription}>Equipment and lines</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolCard}>
              <View style={styles.toolIconContainer}>
                <Text style={styles.toolIcon}>💳</Text>
              </View>
              <Text style={styles.toolTitle}>Subscription</Text>
              <Text style={styles.toolDescription}>Billing and payments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolCard}>
              <View style={styles.toolIconContainer}>
                <Text style={styles.toolIcon}>🔔</Text>
              </View>
              <Text style={styles.toolTitle}>Notifications</Text>
              <Text style={styles.toolDescription}>Alerts and reminders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expert Remote Tools */}
        {role === 'expert' && (
          <View style={styles.expertSection}>
            <Text style={styles.sectionTitleModern}>Expert Remote Tools</Text>
            
            <TouchableOpacity style={styles.expertToolCard}>
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4']}
                style={styles.expertToolGradient}
              >
                <View style={styles.expertToolContent}>
                  <Text style={styles.expertToolIcon}>🖥️</Text>
                  <View style={styles.expertToolInfo}>
                    <Text style={styles.expertToolTitle}>Remote AR Editor</Text>
                    <Text style={styles.expertToolDesc}>
                      Edit procedures remotely without site visits
                    </Text>
                  </View>
                  <Text style={styles.expertToolArrow}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.expertToolCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.expertToolGradient}
              >
                <View style={styles.expertToolContent}>
                  <Text style={styles.expertToolIcon}>🔄</Text>
                  <View style={styles.expertToolInfo}>
                    <Text style={styles.expertToolTitle}>Cross-Plant Sync</Text>
                    <Text style={styles.expertToolDesc}>
                      Replicate anchors across similar equipment
                    </Text>
                  </View>
                  <Text style={styles.expertToolArrow}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* System Status */}
        <View style={styles.systemStatusSection}>
          <Text style={styles.sectionTitleModern}>System Connectors</Text>
          
          <View style={styles.connectorsList}>
            {[
              { name: 'SSO Connector', status: 'Active', icon: '🔐' },
              { name: 'Database', status: 'Connected', icon: '💾' },
              { name: 'Payment Gateway', status: 'Active', icon: '💳' },
              { name: 'Subscription', status: 'Running', icon: '📊' },
            ].map((connector, index) => (
              <View key={index} style={styles.connectorCard}>
                <Text style={styles.connectorCardIcon}>{connector.icon}</Text>
                <View style={styles.connectorCardInfo}>
                  <Text style={styles.connectorCardName}>{connector.name}</Text>
                  <View style={styles.connectorStatusBadge}>
                    <View style={styles.connectorStatusDot} />
                    <Text style={styles.connectorStatusText}>{connector.status}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.connectorConfigButton}>
                  <Text style={styles.configIcon}>⚙️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles with modern UI enhancements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Enhanced Login Styles
  loginContainer: {
    flex: 1,
  },
  loginGradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  loginCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modernInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.textSecondary,
    fontSize: 14,
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ssoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  ssoButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  
  // Enhanced Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dashboardHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  createButtonText: {
    fontSize: 32,
    color: 'white',
    lineHeight: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -10,
  },
  dashboardCardContainer: {
    width: (width - 40) / 2,
    padding: 10,
  },
  modernDashboardCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    minHeight: 160,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardIcon: {
    fontSize: 32,
  },
  trendBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  recentSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIndicator: {
    marginRight: 12,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  webPortalCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  webPortalGradient: {
    padding: 20,
  },
  webPortalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webPortalIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  webPortalTextContainer: {
    flex: 1,
  },
  webPortalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  webPortalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  webPortalArrow: {
    fontSize: 24,
    color: 'white',
  },
  
  // Create Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  createMenuModern: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
  },
  menuHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  createMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  createMenuCard: {
    width: (width - 60) / 2,
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
  },
  menuIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 36,
  },
  createMenuCardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Enhanced Screen Common Styles
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: 'white',
  },
  screenTitleModern: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  
  // Enhanced Form Styles
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  formSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  modernFormInput: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  nextButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonArrow: {
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
  },
  
  // Template/Type Selection Styles
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  templateCard: {
    width: (width - 80) / 2,
    padding: 16,
    margin: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  templateIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },
  
  // Camera/Capture Styles
  captureContainer: {
    flex: 1,
  },
  modernCameraView: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'relative',
  },
  cameraCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.secondary,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraInstruction: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: 'white',
    fontSize: 14,
  },
  captureControlsModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.surface,
  },
  captureButtonModern: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  captureButtonCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  imageCounter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  imageCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  imageCountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  processButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // AI Results/Review Styles
  reviewContainer: {
    flex: 1,
    padding: 20,
  },
  aiResultsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  findingsContainer: {
    marginBottom: 20,
  },
  findingCard: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  findingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  findingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  editIcon: {
    fontSize: 18,
  },
  findingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  findingActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Guide Specific Styles
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  typeOption: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    margin: 5,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 2,
  },
  typeOptionSelected: {
    backgroundColor: colors.primary + '10',
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  typeLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  guideStepsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stepsScrollView: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: '600',
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stepMenu: {
    padding: 5,
  },
  menuDots: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  stepImageArea: {
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepInput: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  guideFooter: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  addStepButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  addStepIcon: {
    fontSize: 20,
    color: colors.primary,
    marginRight: 8,
  },
  addStepText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaOptionsModern: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  mediaCardModern: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mediaCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  mediaCardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  mediaCardIcon: {
    fontSize: 36,
    marginBottom: 10,
    color: colors.textSecondary,
  },
  mediaCardIconSelected: {
    color: 'white',
  },
  mediaCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  mediaCardTitleSelected: {
    color: 'white',
  },
  mediaCardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mediaCardDescSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  videoPreviewModern: {
    height: 200,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playButtonModern: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  playIcon: {
    fontSize: 30,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: 'white',
    fontSize: 12,
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Analysis Results Styles
  analysisResults: {
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  resultCard: {
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  severityBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  severityText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsList: {
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  saveAnalysisButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // AR/Mapping Enhanced Styles
  arContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  arViewModern: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  arGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  arGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  arGridLine: {
    width: width / 4,
    height: height / 8,
    borderWidth: 0.5,
    borderColor: 'rgba(90,200,250,0.2)',
  },
  arCrosshairModern: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginTop: -60,
    marginLeft: -60,
  },
  arCrosshairHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.secondary,
  },
  arCrosshairVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.secondary,
  },
  arCrosshairCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginTop: -10,
    marginLeft: -10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: 'rgba(90,200,250,0.2)',
  },
  arInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  arInfoIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  arInfoText: {
    color: 'white',
    fontSize: 12,
  },
  arInstructionModern: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: 'white',
    fontSize: 14,
  },
  arControlsModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
  },
  arActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  arButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  arButtonIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  arButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  arCaptureButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  arCaptureGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arCaptureIcon: {
    fontSize: 36,
  },
  
  // Grid Inputs
  gridInputs: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  gridInputItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  
  // Anchor Editing Styles
  anchorEditContainer: {
    flex: 1,
  },
  anchorMapView: {
    height: 300,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  anchorMapBackground: {
    flex: 1,
    position: 'relative',
  },
  anchorPinModern: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
  },
  anchorPinGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorPinNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addAnchorFloating: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addAnchorGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnchorPlus: {
    fontSize: 28,
    color: 'white',
  },
  anchorListModern: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  anchorListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  anchorScrollList: {
    flex: 1,
    marginBottom: 20,
  },
  anchorListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  anchorListLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  anchorBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  anchorBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  anchorNameField: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  addStepsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStepsIcon: {
    fontSize: 20,
  },
  saveMappingButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveMappingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Web Portal Enhanced Styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webHeaderModern: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  webHeaderContent: {
    flex: 1,
    alignItems: 'center',
  },
  webHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  webHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  webProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  webTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  webTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  webTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  webTabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  webTabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  webTabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  webContent: {
    flex: 1,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: (width - 40) / 2,
    padding: 10,
  },
  statCardGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  statCardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendIcon: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  trendValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Management Section
  managementSection: {
    padding: 20,
  },
  sectionTitleModern: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  toolCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.surface,
    margin: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  toolIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolIcon: {
    fontSize: 28,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Expert Section
  expertSection: {
    padding: 20,
  },
  expertToolCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  expertToolGradient: {
    padding: 20,
  },
  expertToolContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertToolIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  expertToolInfo: {
    flex: 1,
  },
  expertToolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  expertToolDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  expertToolArrow: {
    fontSize: 24,
    color: 'white',
  },
  
  // System Status Section
  systemStatusSection: {
    padding: 20,
  },
  connectorsList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
  },
  connectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  connectorCard: {
    borderBottomWidth: 0,
  },
  connectorCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  connectorCardInfo: {
    flex: 1,
  },
  connectorCardName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  connectorStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  connectorStatusText: {
    fontSize: 12,
    color: colors.success,
  },
  connectorConfigButton: {
    padding: 8,
  },
  configIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  // Additional styles continue in next artifact if needed...
});

export default App;