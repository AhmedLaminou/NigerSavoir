package com.nigersavoir.service;

import com.nigersavoir.dto.CreateOrderRequest;
import com.nigersavoir.dto.OrderResponse;
import com.nigersavoir.entity.Book;
import com.nigersavoir.entity.Order;
import com.nigersavoir.entity.OrderItem;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.BookRepository;
import com.nigersavoir.repository.OrderRepository;
import com.nigersavoir.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class MarketplaceService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Book> searchBooks(String q, String subject, String level, Long schoolId) {
        return bookRepository.search(q, subject, level, schoolId);
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public List<Book> getBooksByIds(Collection<Long> ids) {
        return bookRepository.findAllById(ids);
    }

    @Transactional
    public OrderResponse createOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Empty order");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.Status.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setItems(new ArrayList<>());

        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.Item it : request.getItems()) {
            if (it.getBookId() == null || it.getQuantity() == null || it.getQuantity() <= 0) {
                throw new RuntimeException("Invalid order item");
            }

            Book book = bookRepository.findById(it.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            int stock = book.getStock() == null ? 0 : book.getStock();
            if (stock < it.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + book.getTitle());
            }

            book.setStock(stock - it.getQuantity());
            bookRepository.save(book);

            BigDecimal unitPrice = book.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(it.getQuantity()));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setBook(book);
            oi.setQuantity(it.getQuantity());
            oi.setUnitPrice(unitPrice);
            oi.setLineTotal(lineTotal);

            order.getItems().add(oi);
            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public List<OrderResponse> listMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream().map(this::toResponse).toList();
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());
        resp.setStatus(order.getStatus());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setCreatedAt(order.getCreatedAt());

        List<OrderResponse.Item> items = new ArrayList<>();
        for (OrderItem it : order.getItems()) {
            items.add(new OrderResponse.Item(
                    it.getBook().getId(),
                    it.getBook().getTitle(),
                    it.getBook().getAuthor(),
                    it.getQuantity(),
                    it.getUnitPrice(),
                    it.getLineTotal()
            ));
        }
        resp.setItems(items);
        return resp;
    }
}
