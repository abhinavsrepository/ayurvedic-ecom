import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { theme } from '../styles/theme';
import { Header, Button, EmptyState } from '../components';
import { useCart } from '../hooks/useCart';
import { useNavigation } from '@react-navigation/native';

/**
 * Cart Screen
 * Displays cart items with swipe-to-delete and quantity management
 */
export const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const { cart, removeFromCart, updateQuantity, itemCount } = useCart();

  const renderRightActions = (productId: string, productName: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          Alert.alert(
            'Remove Item',
            `Remove ${productName} from cart?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => removeFromCart(productId),
              },
            ]
          );
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#FFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderCartItem = ({ item }: any) => {
    const { product, quantity } = item;

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(product.id, product.name)}
        overshootRight={false}
      >
        <View style={styles.cartItem}>
          <Image source={{ uri: product.thumbnail }} style={styles.productImage} />

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, quantity - 1)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={16} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, quantity + 1)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={16} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => removeFromCart(product.id)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  if (itemCount === 0) {
    return (
      <View style={styles.container}>
        <Header title="Shopping Cart" showBack showCart={false} />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Add some amazing Ayurvedic products to get started"
          actionLabel="Continue Shopping"
          onAction={() => navigation.navigate('Products' as never)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Shopping Cart" showBack showCart={false} />

      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      {/* Cart Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${cart.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${cart.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}
          </Text>
        </View>
        {cart.subtotal < 50 && (
          <Text style={styles.freeShippingNote}>
            Add ${(50 - cart.subtotal).toFixed(2)} more for FREE shipping!
          </Text>
        )}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
        </View>

        <Button
          title={`Checkout (${itemCount} items)`}
          onPress={() => navigation.navigate('Checkout' as never)}
          fullWidth
          size="lg"
          icon="arrow-forward"
          iconPosition="right"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  listFooter: {
    height: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityText: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: theme.spacing.xs,
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  deleteText: {
    color: '#FFF',
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.medium,
    marginTop: theme.spacing.xs,
  },
  summary: {
    backgroundColor: '#FFF',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
    fontWeight: theme.fonts.weights.medium,
  },
  freeShippingNote: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalLabel: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
  },
});
