import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import ImageGrid from "@/components/ImageGrid";
import { debounce } from "lodash";
import FM from "@/components/FM";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const modalRef = useRef(null);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    // Initial image fetch to display something when no search is performed
    fetchImages();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const fetchImages = async (params = { page: 1 }, append = false) => {
    console.log("Fetching images with params:", params);
    const endpoint = params.query ? "/search/photos" : "/photos/random";
    const isSearch = !!params.query;

    const apiParams = isSearch
      ? { query: params.query, page: params.page }
      : { count: 5 }; // Fetch 10 random images if no query

    let res = await apiCall(endpoint, apiParams);
    if (res.success && res?.data) {
      const newImages = isSearch ? res.data.results : res.data; // Adjust based on endpoint
      setImages(append ? [...images, ...newImages] : newImages);
    } else {
      console.error("Error fetching images:", res.msg);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    console.log("searching for:", text);

    if (text.length > 2) {
      // Fetch images when search query has at least 3 characters
      fetchImages({ query: text, page: 1 });
    }

    if (text === "") {
      // Reset search when input is cleared
      fetchImages({ page: 1 });
    }
  };

  // Debounce the search input handler
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
    fetchImages({ page: 1 }); // Reset to default fetch when search is cleared
  };

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    fetchImages({ query: cat, page: 1 }); // Fetch images based on selected category
  };

  const openFilterModal = () => {
    modalRef?.current?.present();
  };

  const closeFilterModal = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      const page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

  const resetFilters = () => {
    console.log("reset filters");
    setFilters(null);
    closeFilterModal();
  };

  console.log("filters:", filters);
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Wallpaper</Text>
        </Pressable>
        <Pressable onPress={openFilterModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 15 }}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
          </View>

          <TextInput
            placeholder="Search for photos... "
            style={styles.searchInput}
            ref={searchInputRef}
            onChangeText={handleTextDebounce} // Debounced search handler
          />

          {search && (
            <Pressable onPress={clearSearch} style={styles.closeIcon}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* Images Grid */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
      <FM
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFilterModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
    outline: "none",
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  categories: {
    marginHorizontal: wp(4),
  },
});

export default HomeScreen;