package com.nigersavoir.dto;

import com.nigersavoir.entity.BookReaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookReactionRequest {
    private BookReaction.ReactionType reactionType;
}
