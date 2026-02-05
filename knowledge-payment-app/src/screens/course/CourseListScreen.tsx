import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar, Card, Title, Paragraph, Button } from 'react-native-paper';

import { RootStackParamList } from '../../types/models';
import { COLORS, FONT_SIZES, SPACING, COURSE_CATEGORIES } from '../../utils/constants';

type CourseListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CourseList'>;
type CourseListScreenRouteProp = RouteProp<RootStackParamList, 'CourseList'>;

// 模拟课程数据
const mockCourses = [
  {
    id: '1',
    title: '高效沟通技巧',
    description: '提升职场沟通能力，学会有效表达和倾听',
    instructor: '张老师',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    studentCount: 1250,
    duration: 480,
    image: 'https://picsum.photos/300/200?random=1',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Python数据分析实战',
    description: '从零开始学习Python数据分析，掌握数据处理和可视化',
    instructor: '李教授',
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    studentCount: 2350,
    duration: 720,
    image: 'https://picsum.photos/300/200?random=2',
    isFeatured: true,
  },
  {
    id: '3',
    title: '项目管理实战指南',
    description: '系统学习项目管理方法论，掌握项目规划与执行',
    instructor: '王总监',
    price: 249,
    originalPrice: 399,
    rating: 4.7,
    studentCount: 1890,
    duration: 600,
    image: 'https://picsum.photos/300/200?random=3',
    isFeatured: false,
  },
  {
    id: '4',
    title: '商业思维训练营',
    description: '培养商业洞察力，提升决策能力',
    instructor: '赵博士',
    price: 399,
    originalPrice: 599,
    rating: 4.8,
    studentCount: 1560,
    duration: 540,
    image: 'https://picsum.photos/300/200?random=4',
    isFeatured: true,
  },
];

const CourseListScreen: React.FC = () => {
  const navigation = useNavigation<CourseListScreenNavigationProp>();
  const route = useRoute<CourseListScreenRouteProp>();
  
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');
  const [courses, setCourses] = useState(mockCourses);
  const [refreshing, setRefreshing] = useState(false);

  // 获取分类名称
  const getCategoryName = (id: string) => {
    if (id === 'all') return '全部课程';
    const category = COURSE_CATEGORIES.find(cat => cat.id === id);
    return category ? category.name : '全部课程';
  };

  // 处理刷新
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 处理课程点击
  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  // 渲染课程项
  const renderCourseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => handleCoursePress(item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.courseCard}>
        <Card.Cover
          source={{ uri: item.image }}
          style={styles.courseImage}
        />
        {item.isFeatured && (
          <View style={styles.featuredBadge}>
            <MaterialCommunityIcons name="star" size={12} color={COLORS.WHITE} />
            <Text style={styles.featuredText}>精选</Text>
          </View>
        )}
        <Card.Content style={styles.courseContent}>
          <Title style={styles.courseTitle} numberOfLines={2}>
            {item.title}
          </Title>
          
          <Paragraph style={styles.courseDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <View style={styles.courseMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="account" size={14} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.metaText}>{item.instructor}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.metaText}>{Math.floor(item.duration / 60)}小时</Text>
            </View>
          </View>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.WARNING} />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={16} color={COLORS.PRIMARY} />
              <Text style={styles.statText}>{item.studentCount.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>¥{item.price}</Text>
            {item.originalPrice && item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>¥{item.originalPrice}</Text>
            )}
            <Button
              mode="contained"
              style={styles.viewButton}
              contentStyle={styles.viewButtonContent}
              onPress={() => handleCoursePress(item.id)}
            >
              查看详情
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="搜索课程..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={COLORS.PRIMARY}
        />
      </View>

      {/* 分类筛选 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === 'all' && styles.categoryChipSelected,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.categoryChipText,
            selectedCategory === 'all' && styles.categoryChipTextSelected,
          ]}>
            全部
          </Text>
        </TouchableOpacity>
        {COURSE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialCommunityIcons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? COLORS.WHITE : COLORS.PRIMARY}
              style={styles.categoryIcon}
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextSelected,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 课程列表 */}
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.courseList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
        ListHeaderComponent={
          <Text style={styles.resultCount}>
            共找到 {courses.length} 门课程
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  searchContainer: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 8,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    marginRight: SPACING.SM,
    backgroundColor: COLORS.GRAY_1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_3,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryIcon: {
    marginRight: SPACING.XS,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  categoryChipTextSelected: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  courseList: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  resultCount: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  courseItem: {
    marginBottom: SPACING.MD,
  },
  courseCard: {
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseImage: {
    height: 160,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.SM,
    left: SPACING.SM,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WARNING,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.XS,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  courseContent: {
    padding: SPACING.MD,
  },
  courseTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    marginBottom: SPACING.XS,
    lineHeight: 22,
  },
  courseDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: 18,
  },
  courseMeta: {
    flexDirection: 'row',
    marginBottom: SPACING.SM,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.LG,
  },
  metaText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.LG,
  },
  statText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPrice: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  originalPrice: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_DISABLED,
    textDecorationLine: 'line-through',
    marginLeft: SPACING.SM,
  },
  viewButton: {
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  viewButtonContent: {
    paddingHorizontal: SPACING.LG,
  },
});

export default CourseListScreen;