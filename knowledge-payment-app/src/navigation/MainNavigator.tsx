import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ROUTES, COLORS } from '../utils/constants';
import { RootStackParamList } from '../types/models';

// 导入主屏幕
import HomeScreen from '../screens/home/HomeScreen';
import CourseListScreen from '../screens/course/CourseListScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// 导入其他屏幕
import CourseDetailScreen from '../screens/course/CourseDetailScreen';
import LessonPlayerScreen from '../screens/course/LessonPlayerScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import MyCoursesScreen from '../screens/profile/MyCoursesScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<RootStackParamList>();
const CourseStack = createStackNavigator<RootStackParamList>();
const ProfileStack = createStackNavigator<RootStackParamList>();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '智学平台',
        }}
      />
      <HomeStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          title: '课程详情',
        }}
      />
      <HomeStack.Screen
        name="LessonPlayer"
        component={LessonPlayerScreen}
        options={{
          title: '课程播放',
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

// Course Stack Navigator
const CourseStackNavigator = () => {
  return (
    <CourseStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <CourseStack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{
          title: '课程中心',
        }}
      />
      <CourseStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          title: '课程详情',
        }}
      />
      <CourseStack.Screen
        name="LessonPlayer"
        component={LessonPlayerScreen}
        options={{
          title: '课程播放',
          headerShown: false,
        }}
      />
    </CourseStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '个人中心',
        }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
        }}
      />
      <ProfileStack.Screen
        name="MyCourses"
        component={MyCoursesScreen}
        options={{
          title: '我的课程',
        }}
      />
      <ProfileStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: '支付',
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY_4,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.GRAY_3,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeStackNavigator}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.COURSES}
        component={CourseStackNavigator}
        options={{
          tabBarLabel: '课程',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.COMMUNITY}
        component={CommunityScreen}
        options={{
          tabBarLabel: '社区',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;