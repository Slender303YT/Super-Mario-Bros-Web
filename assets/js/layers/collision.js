function createBoudingBoxLayer(entities) {
	return function drawboundingBox(ctx, camera) {
		ctx.strokeStyle = 'red';
	    entities.forEach(entity => {
	       	ctx.beginPath();
	        ctx.rect(entity.bounds.left - camera.pos.x,
	           		 entity.bounds.top - camera.pos.y,
	           		 entity.size.x,
	           		 entity.size.y);
	        ctx.stroke();
	    });
	}
}

function createTileCandidateLayer(tileResolver) {
	const resolvedTiles = [];

	const tileSize = tileResolver.tileSize;

	const getByIndexOriginal = tileResolver.getByIndex;
	tileResolver.getByIndex = function getByIndexFake(x, y) {
		resolvedTiles.push({x, y});
		return getByIndexOriginal.call(tileResolver, x, y);
	};

	return function drawTileCandidates(ctx, camera) {
		ctx.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            ctx.beginPath();
            ctx.rect(x * tileSize - camera.pos.x,
            		 y * tileSize - camera.pos.y,
            		 tileSize, tileSize);
            ctx.stroke();
        });

		resolvedTiles.length = 0;
	}
}

export function createCollisionLayer(level) {
	const drawTileCandidates = level.tileCollider.resolvers.map(createTileCandidateLayer);
	const drawBoundingBoxes = createBoudingBoxLayer(level.entities);

	return function drawCollision(ctx, camera) {
		drawTileCandidates.forEach(draw => draw(ctx, camera));
		drawBoundingBoxes(ctx, camera);
	};
}