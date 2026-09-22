package com.lucky.main.config;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lucky.main.dto.CartResponse;
import com.lucky.main.dto.RecentOrderDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory redisConnectionFactory) {

        GenericJackson2JsonRedisSerializer jsonSerializer =
                new GenericJackson2JsonRedisSerializer()
                        .configure(objectMapper -> {

                            objectMapper.registerModule(
                                    new JavaTimeModule()
                            );

                            objectMapper.disable(
                                    SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
                            );
                        });

        RedisCacheConfiguration defaultConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(10))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(jsonSerializer)
                        );

        Map<String, RedisCacheConfiguration> cacheConfigurations =
                new HashMap<>();

        cacheConfigurations.put(
                "foods",
                defaultConfig
        );

        // Only for cartItems
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
        );

        JavaType cartType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, CartResponse.class);

        JavaType recentOrderType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, RecentOrderDTO.class);

        cacheConfigurations.put(
                "cartItems",
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(
                                        new Jackson2JsonRedisSerializer<>(
                                                objectMapper,
                                                cartType
                                        )
                                )
                )
        );

        cacheConfigurations.put(
                "orderAnalytics",
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(
                                        new Jackson2JsonRedisSerializer<>(
                                                objectMapper,
                                                recentOrderType
                                        )
                                )
                )
        );

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}