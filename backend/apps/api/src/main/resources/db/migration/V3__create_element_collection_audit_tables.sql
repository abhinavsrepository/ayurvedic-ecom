-- Create audit table for product_tags
CREATE TABLE product_tags_aud (
    product_id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    tag VARCHAR(255),
    PRIMARY KEY (product_id, rev, tag),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- Create audit table for product_images
CREATE TABLE product_images_aud (
    product_id UUID NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    url VARCHAR(1000),
    alt_text VARCHAR(500),
    image_order INTEGER,
    PRIMARY KEY (product_id, rev, image_order),
    FOREIGN KEY (rev) REFERENCES revinfo (rev)
);
