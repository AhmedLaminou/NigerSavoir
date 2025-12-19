package com.nigersavoir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderRow {
    private Long id;
    private String status;
    private BigDecimal totalAmount;
    private String createdAt;
    private String userEmail;
    private Integer itemCount;
}
