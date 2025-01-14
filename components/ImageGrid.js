import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import React from "react";
import ImageCard from "./ImageCard";
import { getColumnCount, wp } from "@/helpers/common";

const ImageGrid = ({ images }) => {

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No images to display.</Text>
      </View>
    );
  }

  const columns = getColumnCount();
 
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainerStyle}
        
        renderItem={({ item , index }) => <ImageCard item={item} columns={columns} index={index} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 300, // Adjust this as needed
    width: wp(100),
  },
  listContainerStyle:{
    paddingHorizontal : wp(4)
  }



});

export default ImageGrid;
