package com.nigersavoir.controller;

import com.nigersavoir.dto.CreateOrderRequest;
import com.nigersavoir.dto.OrderResponse;
import com.nigersavoir.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping("/mine")
    public ResponseEntity<List<OrderResponse>> myOrders(Authentication authentication) {
        return ResponseEntity.ok(marketplaceService.listMyOrders(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@RequestBody CreateOrderRequest request, Authentication authentication) {
        return ResponseEntity.ok(marketplaceService.createOrder(authentication.getName(), request));
    }
}
