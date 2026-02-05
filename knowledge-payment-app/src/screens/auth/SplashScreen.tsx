import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.PRIMARY}
        translucent={false}
      />
      
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>智</Text>
          </View>
          <Text style={styles.appName}>智学平台</Text>
        </View>
        
        {/* Slogan */}
        <Text style={styles.slogan}>让学习更高效，让知识更有价值</Text>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
        
        {/* Version info */}
        <Text style={styles.versionText}>版本 1.0.0</Text>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 智学平台 版权所有</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  appName: {
    fontSize: FONT_SIZES.XXXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginTop: SPACING.SM,
  },
  slogan: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XXL,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.XL,
  },
  loadingText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
  },
  versionText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_DISABLED,
    position: 'absolute',
    bottom: SPACING.XXL,
  },
  footer: {
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_2,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_DISABLED,
  },
});

export default SplashScreen;