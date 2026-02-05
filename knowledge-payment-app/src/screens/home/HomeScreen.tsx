import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

import { RootStackParamList } from '../../types/models';
import { COLORS, FONT_SIZES, SPACING, COURSE_CATEGORIES } from '../../utils/constants';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width: screenWidth } = Dimensions.get('window');

// 模拟数据
const featuredCourses = [
  {
    id: '1',
    title: '高效沟通技巧',
    instructor: '张老师',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    studentCount: 1250,
    image: 'https://picsum.photos/300/200?random=1',
  },
  {
    id: '2',
    title: 'Python数据分析',
    instructor: '李教授',
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    studentCount: 2350,
    image: 'https://picsum.photos/300/200?random=2',
  },
  {
    id: '3',
    title: '项目管理实战',
    instructor: '王总监',
    price: 249,
    originalPrice: 399,
    rating: 4.7,
    studentCount: 1890,
    image: 'https://picsum.photos/300/200?random=3',
  },
];

const recommendedCourses = [
  {
    id: '4',
    title: '职场写作技巧',
    instructor: '陈老师',
    price: 159,
    rating: 4.6,
    studentCount: 890,
    image: 'https://picsum.photos/200/150?random=4',
  },
  {
    id: '5',
    title: '商业思维训练',
    instructor: '赵博士',
    price: 299,
    rating: 4.8,
    studentCount: 1560,
    image: 'https://picsum.photos/200/150?random=5',
  },
  {
    id: '6',
    title: 'React Native入门',
    instructor: '钱工程师',
    price: 199,
    rating: 4.9,
    studentCount: 3210,
    image: 'https://picsum.photos/200/150?random=6',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('CourseList', { categoryId });
  };

  const handleSearchPress = () => {
    // 搜索功能待实现
    console.log('Search pressed');
  };

  const handleSeeAllFeatured = () => {
    navigation.navigate('CourseList');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>早上好，学习者！</Text>
        <Text style={styles.subGreeting}>今天想学点什么？</Text>
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
        <MaterialCommunityIcons name="magnify" size={24} color={COLORS.GRAY_4} />
      </TouchableOpacity>
    </View>
  );

  const renderBanner = () => (
    <Card style={styles.bannerCard}>
      <Card.Content style={styles.bannerContent}>
        <View style={styles.bannerTextContainer}>
          <Title style={styles.bannerTitle}>限时特惠</Title>
          <Paragraph style={styles.bannerSubtitle}>
            年度会员低至66元/月，立即抢购
          </Paragraph>
          <Button
            mode="contained"
            style={styles.bannerButton}
            contentStyle={styles.bannerButtonContent}
            onPress={() => console.log('Learn more')}
          >
            了解更多
          </Button>
        </View>
        <View style={styles.bannerImageContainer}>
          <MaterialCommunityIcons name="star-circle" size={80} color={COLORS.WHITE} />
        </View>
      </Card.Content>
    </Card>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>课程分类</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CourseList' as never)}>
          <Text style={styles.seeAllText}>全部</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {COURSE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.categoryIcon}>
              <MaterialCommunityIcons
                name={category.icon as any}
                size={32}
                color={COLORS.PRIMARY}
              />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeaturedCourses = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>精选课程</Text>
        <TouchableOpacity onPress={handleSeeAllFeatured}>
          <Text style={styles.seeAllText}>查看全部</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.coursesScroll}
      >
        {featuredCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.featuredCourseCard}
            onPress={() => handleCoursePress(course.id)}
          >
            <Card style={styles.courseCard}>
              <Card.Cover
                source={{ uri: course.image }}
                style={styles.courseImage}
              />
              <Card.Content style={styles.courseContent}>
                <Title style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Title>
                <Paragraph style={styles.courseInstructor}>
                  {course.instructor}
                </Paragraph>
                <View style={styles.courseStats}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="star" size={16} color={COLORS.WARNING} />
                    <Text style={styles.statText}>{course.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="account-group" size={16} color={COLORS.PRIMARY} />
                    <Text style={styles.statText}>{course.studentCount}</Text>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>¥{course.price}</Text>
                  {course.originalPrice && (
                    <Text style={styles.originalPrice}>¥{course.originalPrice}</Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecommendedCourses = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>为你推荐</Text>
      </View>
      {recommendedCourses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.recommendedCourseItem}
          onPress={() => handleCoursePress(course.id)}
        >
          <Image
            source={{ uri: course.image }}
            style={styles.recommendedCourseImage}
          />
          <View style={styles.recommendedCourseInfo}>
            <Text style={styles.recommendedCourseTitle} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={styles.recommendedCourseInstructor}>
              {course.instructor}
            </Text>
            <View style={styles.recommendedCourseStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={14} color={COLORS.WARNING} />
                <Text style={styles.smallStatText}>{course.rating}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="account-group" size={14} color={COLORS.PRIMARY} />
                <Text style={styles.smallStatText}>{course.studentCount}</Text>
              </View>
            </View>
            <Text style={styles.recommendedCoursePrice}>¥{course.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderBanner()}
      {renderCategories()}
      {renderFeaturedCourses()}
      {renderRecommendedCourses()}
      
      {/* Footer spacer */}
      <View style={styles.footerSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.WHITE,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subGreeting: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  searchButton: {
    padding: SPACING.SM,
    backgroundColor: COLORS.GRAY_1,
    borderRadius: 20,
  },
  bannerCard: {
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.LG,
    backgroundColor: COLORS.PRIMARY,
    elevation: 4,
    borderRadius: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.XS,
  },
  bannerSubtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.WHITE,
    opacity: 0.9,
    marginBottom: SPACING.MD,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
  },
  bannerButtonContent: {
    paddingHorizontal: SPACING.LG,
  },
  bannerImageContainer: {
    marginLeft: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
  },
  categoriesScroll: {
    paddingLeft: SPACING.MD,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.LG,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.GRAY_1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  categoryName: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  coursesScroll: {
    paddingLeft: SPACING.MD,
  },
  featuredCourseCard: {
    width: screenWidth * 0.7,
    marginRight: SPACING.MD,
  },
  courseCard: {
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseImage: {
    height: 140,
  },
  courseContent: {
    padding: SPACING.MD,
  },
  courseTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    marginBottom: SPACING.XS,
    lineHeight: 20,
  },
  courseInstructor: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  statText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  originalPrice: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_DISABLED,
    textDecorationLine: 'line-through',
    marginLeft: SPACING.SM,
  },
  recommendedCourseItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  recommendedCourseImage: {
    width: 100,
    height: 100,
  },
  recommendedCourseInfo: {
    flex: 1,
    padding: SPACING.MD,
  },
  recommendedCourseTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    lineHeight: 20,
  },
  recommendedCourseInstructor: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  recommendedCourseStats: {
    flexDirection: 'row',
    marginBottom: SPACING.XS,
  },
  smallStatText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  recommendedCoursePrice: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  footerSpacer: {
    height: SPACING.XXL,
  },
});

export default HomeScreen;